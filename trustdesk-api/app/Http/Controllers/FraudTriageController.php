<?php

namespace App\Http\Controllers;

use App\Models\AlertAction;
use App\Models\FraudAlert;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * FraudTriageController — Agent fraud-alert queue and actions.
 *
 * Replaces the legacy TriageController with financial-domain
 * KPIs, resolution tracking, and FinTech-specific agent actions.
 * Only accessible by agents and admins.
 */
class FraudTriageController extends Controller
{
    /**
     * Get the fraud triage queue — open/investigating/escalated alerts sorted by risk.
     */
    public function queue(Request $request): JsonResponse
    {
        if (! $request->user()->isAgent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $alerts = FraudAlert::with(['user:id,name,email', 'evidence'])
            ->whereIn('status', ['open', 'investigating', 'escalated'])
            ->orderByDesc('risk_score')
            ->orderBy('created_at')
            ->paginate(min((int) $request->input('per_page', 20), 50));

        return response()->json($alerts);
    }

    /**
     * Take a triage action on a fraud alert.
     */
    public function action(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isAgent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $alert = FraudAlert::findOrFail($id);

        $validated = $request->validate([
            'action' => ['required', 'string', Rule::in(AlertAction::ACTIONS)],
            'notes'  => ['nullable', 'string', 'max:1000'],
        ]);

        // Record the action
        $alertAction = AlertAction::create([
            'fraud_alert_id' => $alert->id,
            'user_id'        => $request->user()->id,
            'action'         => $validated['action'],
            'notes'          => $validated['notes'] ?? null,
        ]);

        // Side-effects: update alert state based on action
        $statusMap = [
            'assigned'     => 'investigating',
            'escalated'    => 'escalated',
            'resolved'     => 'resolved',
            'closed'       => 'closed',
        ];

        if (isset($statusMap[$validated['action']])) {
            $updateData = ['status' => $statusMap[$validated['action']]];
            if ($validated['action'] === 'resolved') {
                $updateData['resolved_at'] = now();
            }
            $alert->update($updateData);
        }

        if ($validated['action'] === 'assigned') {
            $alert->update(['assigned_to' => $request->user()->id]);
        }

        AuditService::log('fraud_triage.action', 'fraud_alert', $alert->id, [
            'action' => $validated['action'],
            'agent'  => $request->user()->id,
        ]);

        return response()->json([
            'message'      => "Triage action '{$validated['action']}' applied.",
            'alert_action' => $alertAction,
            'fraud_alert'  => $alert->fresh(),
        ]);
    }

    /**
     * Financial security dashboard KPIs for agents/admins.
     */
    public function dashboard(Request $request): JsonResponse
    {
        if (! $request->user()->isAgent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json([
            'open_alerts'        => FraudAlert::where('status', 'open')->count(),
            'investigating'      => FraudAlert::where('status', 'investigating')->count(),
            'escalated'          => FraudAlert::where('status', 'escalated')->count(),
            'resolved_today'     => FraudAlert::where('status', 'resolved')
                ->whereDate('resolved_at', today())->count(),
            'critical_alerts'    => FraudAlert::where('priority', 'critical')
                ->whereIn('status', ['open', 'investigating'])->count(),
            'avg_risk_score'     => (int) FraudAlert::whereIn('status', ['open', 'investigating', 'escalated'])
                ->avg('risk_score'),
            'total_amount_at_risk' => FraudAlert::whereIn('status', ['open', 'investigating', 'escalated'])
                ->sum('amount_involved'),
            'active_lockdowns'   => \App\Models\EmergencyLockdown::where('is_resolved', false)->count(),
            'frozen_wallets'     => \App\Models\WalletFreeze::where('status', 'frozen')->count(),
            'community_signals'  => \App\Models\CommunitySignal::where('is_false_positive', false)
                ->whereDate('created_at', today())->count(),
        ]);
    }
}
