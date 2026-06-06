<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActivateLockdownRequest;
use App\Models\EmergencyLockdown;
use App\Models\WalletFreeze;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * EmergencyLockdownController — Handles the SOS wallet lockdown flow.
 *
 * This is the most critical financial-security endpoint in the system.
 * Replaces the legacy PanicController.
 *
 * Flow:
 *   1. User activates lockdown → EmergencyLockdown created
 *   2. System auto-freezes wallet + cards → WalletFreeze created
 *   3. Fraud analysts are notified (future: push + SMS)
 *   4. Analyst or user can resolve the lockdown
 *
 * Rate-limited aggressively to prevent abuse (see routes).
 */
class EmergencyLockdownController extends Controller
{
    /**
     * Activate emergency lockdown — freeze wallet, cards, and P2P.
     */
    public function activate(ActivateLockdownRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Prevent duplicate active lockdowns
        $activeLockdown = EmergencyLockdown::where('user_id', $user->id)
            ->where('is_resolved', false)
            ->first();

        if ($activeLockdown) {
            return response()->json([
                'message'  => 'Emergency lockdown already active.',
                'lockdown' => $activeLockdown,
            ], 409);
        }

        // 1. Create lockdown event
        $lockdown = EmergencyLockdown::create([
            'user_id'      => $user->id,
            'device_id'    => $validated['device_id'] ?? null,
            'trigger_type' => $validated['trigger_type'] ?? 'manual',
            'latitude'     => $validated['latitude'] ?? null,
            'longitude'    => $validated['longitude'] ?? null,
        ]);

        // 2. Auto-freeze wallet (full scope)
        $freeze = WalletFreeze::create([
            'user_id'               => $user->id,
            'emergency_lockdown_id' => $lockdown->id,
            'scope'                 => 'full',
            'status'                => 'frozen',
            'reason'                => 'Automatic wallet freeze triggered by emergency lockdown.',
            'frozen_at'             => now(),
        ]);

        // 3. Log the critical event
        AuditService::log('emergency.lockdown_activated', 'emergency_lockdown', $lockdown->id, [
            'trigger_type' => $lockdown->trigger_type,
            'latitude'     => $lockdown->latitude,
            'longitude'    => $lockdown->longitude,
            'freeze_id'    => $freeze->id,
        ]);

        return response()->json([
            'message'       => 'Emergency lockdown activated. Wallet and cards frozen.',
            'lockdown'      => $lockdown,
            'wallet_freeze' => $freeze,
        ], 201);
    }

    /**
     * Resolve a lockdown (analyst-only or self-cancel with confirmation).
     */
    public function resolve(Request $request, int $id): JsonResponse
    {
        $lockdown = EmergencyLockdown::findOrFail($id);
        $user = $request->user();

        // Only owner or agents can resolve
        if ($lockdown->user_id !== $user->id && ! $user->isAgent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($lockdown->is_resolved) {
            return response()->json(['message' => 'Emergency lockdown already resolved.'], 409);
        }

        $request->validate([
            'resolution_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $lockdown->update([
            'is_resolved'      => true,
            'resolved_by'      => $user->id,
            'resolution_notes' => $request->input('resolution_notes'),
            'resolved_at'      => now(),
        ]);

        // Unfreeze associated wallet freeze
        WalletFreeze::where('emergency_lockdown_id', $lockdown->id)
            ->where('status', 'frozen')
            ->update([
                'status'      => 'active',
                'unfrozen_at' => now(),
                'action_by'   => $user->id,
            ]);

        AuditService::log('emergency.lockdown_resolved', 'emergency_lockdown', $lockdown->id, [
            'resolved_by' => $user->id,
        ]);

        return response()->json([
            'message'  => 'Emergency lockdown resolved. Wallet access restored.',
            'lockdown' => $lockdown->fresh(),
        ]);
    }

    /**
     * List lockdown events. Users see their own; agents see all.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = $user->isAgent()
            ? EmergencyLockdown::with('user:id,name,email,role')
            : $user->emergencyLockdowns();

        $events = $query->orderByDesc('created_at')
            ->paginate(min((int) $request->input('per_page', 15), 50));

        return response()->json($events);
    }
}
