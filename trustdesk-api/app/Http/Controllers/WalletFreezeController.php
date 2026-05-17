<?php

namespace App\Http\Controllers;

use App\Models\WalletFreeze;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * WalletFreezeController — Manual wallet freeze/unfreeze operations.
 *
 * Replaces the legacy RestrictionController.
 * Complements the auto-freeze triggered by EmergencyLockdown.
 * Supports scoped freezes: full, card_only, p2p_only, withdrawal_only.
 */
class WalletFreezeController extends Controller
{
    /**
     * Manually freeze a user's wallet (fraud analyst only).
     */
    public function freeze(Request $request): JsonResponse
    {
        if (! $request->user()->isAgent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $request->validate([
            'user_id'        => ['required', 'integer', 'exists:users,id'],
            'fraud_alert_id' => ['nullable', 'integer', 'exists:fraud_alerts,id'],
            'scope'          => ['sometimes', 'string', 'in:' . implode(',', WalletFreeze::SCOPES)],
            'reason'         => ['required', 'string', 'max:500'],
        ]);

        $scope = $request->input('scope', 'full');

        // Check if wallet is already frozen at same or broader scope
        $existing = WalletFreeze::where('user_id', $request->input('user_id'))
            ->where('status', 'frozen')
            ->where('scope', $scope)
            ->first();

        if ($existing) {
            return response()->json([
                'message'       => "Wallet already frozen ({$scope}).",
                'wallet_freeze' => $existing,
            ], 409);
        }

        $freeze = WalletFreeze::create([
            'user_id'            => $request->input('user_id'),
            'fraud_alert_id'     => $request->input('fraud_alert_id'),
            'scope'              => $scope,
            'status'             => 'frozen',
            'is_manual_override' => true,
            'action_by'          => $request->user()->id,
            'reason'             => $request->input('reason'),
            'frozen_at'          => now(),
        ]);

        AuditService::log('wallet.frozen', 'wallet_freeze', $freeze->id, [
            'target_user' => $request->input('user_id'),
            'scope'       => $scope,
            'reason'      => $request->input('reason'),
        ]);

        return response()->json([
            'message'       => "Wallet frozen ({$scope}).",
            'wallet_freeze' => $freeze,
        ], 201);
    }

    /**
     * Unfreeze a wallet (fraud analyst only).
     */
    public function unfreeze(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isAgent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $freeze = WalletFreeze::findOrFail($id);

        if ($freeze->status !== 'frozen') {
            return response()->json(['message' => 'Wallet is not currently frozen.'], 409);
        }

        $freeze->update([
            'status'      => 'active',
            'unfrozen_at' => now(),
            'action_by'   => $request->user()->id,
        ]);

        AuditService::log('wallet.unfrozen', 'wallet_freeze', $freeze->id, [
            'target_user' => $freeze->user_id,
        ]);

        return response()->json([
            'message'       => 'Wallet access restored.',
            'wallet_freeze' => $freeze->fresh(),
        ]);
    }

    /**
     * Get current wallet freeze status for authenticated user.
     */
    public function status(Request $request): JsonResponse
    {
        $activeFreezes = WalletFreeze::where('user_id', $request->user()->id)
            ->where('status', 'frozen')
            ->latest()
            ->get();

        return response()->json([
            'is_frozen' => $activeFreezes->isNotEmpty(),
            'freezes'   => $activeFreezes,
            'scopes'    => $activeFreezes->pluck('scope')->unique()->values(),
        ]);
    }
}
