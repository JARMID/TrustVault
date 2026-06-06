<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * List transactions for the given wallet (owned by the authenticated user).
     */
    public function index(Request $request, int $walletId)
    {
        $wallet = Wallet::where('user_id', $request->user()->id)->findOrFail($walletId);

        $transactions = $wallet->transactions()
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json($transactions);
    }

    /**
     * Create a deposit or withdrawal transaction on the wallet.
     *
     * For P2P transfers use POST /api/wallets/{id}/transfer instead.
     */
    public function store(Request $request, int $walletId)
    {
        $wallet = Wallet::where('user_id', $request->user()->id)->findOrFail($walletId);

        if ($wallet->isFrozen()) {
            return response()->json(['message' => 'Wallet is frozen.'], 403);
        }

        $validated = $request->validate([
            'type'        => 'required|in:deposit,withdrawal',
            'amount'      => 'required|numeric|min:0.01',
            'currency'    => 'string|size:3',
            'description' => 'nullable|string|max:255',
        ]);

        $amount   = (float) $validated['amount'];
        $currency = $validated['currency'] ?? $wallet->currency;

        if ($validated['type'] === 'withdrawal') {
            if ($wallet->balance < $amount) {
                return response()->json(['message' => 'Insufficient balance.'], 422);
            }
        }

        $transaction = DB::transaction(function () use ($wallet, $validated, $amount, $currency) {
            if ($validated['type'] === 'withdrawal') {
                $wallet->debit($amount);
            } else {
                $wallet->credit($amount);
            }

            return Transaction::create([
                'wallet_id'   => $wallet->id,
                'type'        => $validated['type'],
                'amount'      => $amount,
                'currency'    => $currency,
                'status'      => 'completed',
                'description' => $validated['description'] ?? ucfirst($validated['type']),
            ]);
        });

        return response()->json($transaction, 201);
    }
}
