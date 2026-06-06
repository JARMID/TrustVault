<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFraudAlertRequest;
use App\Models\FraudAlert;
use App\Models\FraudAlertEvidence;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * FraudAlertController — Full CRUD for financial fraud reports & disputes.
 *
 * Replaces the legacy IncidentController with banking-domain logic.
 * Regular users can only access their own alerts.
 * Fraud analysts/admins can access all alerts for triage.
 */
class FraudAlertController extends Controller
{
    /**
     * List fraud alerts. Users see only their own; agents see all.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = $user->isAgent()
            ? FraudAlert::with(['user:id,name,email', 'evidence'])
            : $user->fraudAlerts()->with('evidence');

        // Filtering (agents/admins)
        if ($user->isAgent()) {
            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }
            if ($request->filled('priority')) {
                $query->where('priority', $request->input('priority'));
            }
            if ($request->filled('type')) {
                $query->where('type', $request->input('type'));
            }
            if ($request->filled('category')) {
                $query->where('category', $request->input('category'));
            }
            if ($request->filled('min_risk_score')) {
                $query->where('risk_score', '>=', (int) $request->input('min_risk_score'));
            }
        }

        $alerts = $query->orderByDesc('risk_score')
            ->orderByDesc('created_at')
            ->paginate(min((int) $request->input('per_page', 15), 50));

        return response()->json($alerts);
    }

    /**
     * Report a new fraud alert / transaction dispute.
     */
    public function store(StoreFraudAlertRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        // Calculate composite risk score
        $validated['risk_score'] = FraudAlert::calculateRiskScore(
            $validated['type'],
            $validated['priority'] ?? 'normal',
            $validated['amount_involved'] ?? null,
        );

        $alert = FraudAlert::create($validated);

        AuditService::log('fraud_alert.created', 'fraud_alert', $alert->id, [
            'type'            => $alert->type,
            'category'        => $alert->category,
            'priority'        => $alert->priority,
            'risk_score'      => $alert->risk_score,
            'amount_involved' => $alert->amount_involved,
        ]);

        return response()->json([
            'message'     => 'Fraud alert submitted successfully.',
            'fraud_alert' => $alert->load('evidence'),
        ], 201);
    }

    /**
     * Get a single fraud alert. Users can only see their own.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $alert = FraudAlert::with(['user:id,name,email', 'evidence', 'actions.agent:id,name'])
            ->findOrFail($id);

        // OWASP A01:2021 – Broken Access Control
        if (! $request->user()->isAgent() && $alert->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($alert);
    }

    /**
     * Update fraud alert (status/priority for agents, description for owners).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $alert = FraudAlert::findOrFail($id);
        $user = $request->user();

        // OWASP A01: Only the owner or agents can update
        if (! $user->isAgent() && $alert->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $rules = [];
        if ($user->isAgent()) {
            $rules['status']          = ['sometimes', 'string', 'in:' . implode(',', FraudAlert::STATUSES)];
            $rules['priority']        = ['sometimes', 'string', 'in:' . implode(',', FraudAlert::PRIORITIES)];
            $rules['assigned_to']     = ['sometimes', 'nullable', 'integer', 'exists:users,id'];
            $rules['resolution_type'] = ['sometimes', 'nullable', 'string', 'in:' . implode(',', FraudAlert::RESOLUTION_TYPES)];
            $rules['resolution_notes'] = ['sometimes', 'nullable', 'string', 'max:2000'];
        }
        if ($alert->user_id === $user->id) {
            $rules['description'] = ['sometimes', 'string', 'max:2000'];
        }

        $validated = $request->validate($rules);

        // Auto-set resolved_at when status changes to resolved
        if (isset($validated['status']) && $validated['status'] === 'resolved' && ! $alert->resolved_at) {
            $validated['resolved_at'] = now();
        }

        $alert->update($validated);

        AuditService::log('fraud_alert.updated', 'fraud_alert', $alert->id, $validated);

        return response()->json([
            'message'     => 'Fraud alert updated.',
            'fraud_alert' => $alert->fresh(),
        ]);
    }

    /**
     * Upload evidence to a fraud alert.
     * OWASP A04:2021 – Insecure Design: validate file type + size.
     */
    public function uploadEvidence(Request $request, int $id): JsonResponse
    {
        $alert = FraudAlert::findOrFail($id);

        if ($alert->user_id !== $request->user()->id && ! $request->user()->isAgent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $request->validate([
            'file'  => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,pdf,mp4,webm'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $file = $request->file('file');
        $path = $file->store("fraud-evidence/{$alert->id}", 'local');

        $evidence = FraudAlertEvidence::create([
            'fraud_alert_id' => $alert->id,
            'file_path'      => $path,
            'file_type'      => $file->getClientMimeType(),
            'file_name'      => mb_substr($file->getClientOriginalName(), 0, 255),
            'notes'          => $request->input('notes'),
        ]);

        AuditService::log('fraud_evidence.uploaded', 'fraud_alert_evidence', $evidence->id, [
            'fraud_alert_id' => $alert->id,
            'file_type'      => $evidence->file_type,
        ]);

        return response()->json([
            'message'  => 'Evidence uploaded.',
            'evidence' => $evidence,
        ], 201);
    }
}
