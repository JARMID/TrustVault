<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * P2P Transfer — Layer 1 Wallet Engine
 *
 * Transfers funds from the authenticated user's wallet to another user's
 * primary wallet atomically. Both sides are recorded as Transaction rows,
 * and the action is written to audit_logs for the Security OS layer.
 *
 * OWASP A04: Insecure Design mitigations:
 *   - Sender wallet ownership verified via user_id scoping
 *   - Frozen wallet check before any debit
 *   - DB::transaction ensures atomicity
 *   - Audit log written inside the same transaction
 */
class TransferController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'from_wallet_id'     => 'required|integer',
            'to_user_email'      => 'required|email',
            'amount'             => 'required|numeric|min:1',
            'currency'           => 'string|size:3',
            'note'               => 'nullable|string|max:255',
        ]);

        $sender = $request->user();

        // Verify sender wallet ownership
        $fromWallet = Wallet::where('user_id', $sender->id)
            ->where('status', 'active')
            ->findOrFail($validated['from_wallet_id']);

        if ($fromWallet->isFrozen()) {
            return response()->json(['message' => 'Your wallet is frozen. Unfreeze it to send money.'], 403);
        }

        $amount   = (float) $validated['amount'];
        $currency = $validated['currency'] ?? $fromWallet->currency;
        $note     = $validated['note'] ?? 'P2P Transfer';

        if ($fromWallet->balance < $amount) {
            return response()->json(['message' => 'Insufficient balance.'], 422);
        }

        // Find recipient
        $recipient = User::where('email', $validated['to_user_email'])->first();
        if (! $recipient) {
            return response()->json(['message' => 'Recipient not found.'], 404);
        }

        if ($recipient->id === $sender->id) {
            return response()->json(['message' => 'Cannot transfer to yourself.'], 422);
        }

        // Get (or create) recipient's primary wallet
        $toWallet = Wallet::where('user_id', $recipient->id)
            ->where('status', 'active')
            ->first();

        if (! $toWallet) {
            return response()->json(['message' => 'Recipient has no active wallet.'], 422);
        }

        // ── Atomic transfer ───────────────────────────────────────────────────
        $result = DB::transaction(function () use ($fromWallet, $toWallet, $sender, $recipient, $amount, $currency, $note) {
            // Debit sender
            $fromWallet->debit($amount);
            $debitTx = Transaction::create([
                'wallet_id'   => $fromWallet->id,
                'type'        => 'withdrawal',
                'amount'      => $amount,
                'currency'    => $currency,
                'status'      => 'completed',
                'description' => "P2P → {$recipient->name}: {$note}",
            ]);

            // Credit recipient
            $toWallet->credit($amount);
            $creditTx = Transaction::create([
                'wallet_id'   => $toWallet->id,
                'type'        => 'deposit',
                'amount'      => $amount,
                'currency'    => $currency,
                'status'      => 'completed',
                'description' => "P2P ← {$sender->name}: {$note}",
            ]);

            // Audit log (Security OS layer)
            if (class_exists(AuditLog::class)) {
                AuditLog::create([
                    'user_id'       => $sender->id,
                    'action'        => 'p2p_transfer',
                    'resource_type' => 'wallet',
                    'resource_id'   => $fromWallet->id,
                    'ip_address'    => request()->ip(),
                    'user_agent'    => request()->userAgent(),
                    'metadata'      => json_encode([
                        'amount'       => $amount,
                        'currency'     => $currency,
                        'to_user_id'   => $toWallet->user_id,
                        'debit_tx_ref' => $debitTx->reference,
                    ]),
                ]);
            }

            return ['debit' => $debitTx, 'credit' => $creditTx];
        });

        return response()->json([
            'message'    => 'Transfer successful.',
            'reference'  => $result['debit']->reference,
            'amount'     => $amount,
            'currency'   => $currency,
            'recipient'  => $recipient->name,
        ], 201);
    }
}
