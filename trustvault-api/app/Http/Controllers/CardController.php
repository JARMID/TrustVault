<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Wallet;
use Illuminate\Http\Request;

class CardController extends Controller
{
    /**
     * List all cards for a wallet owned by the authenticated user.
     */
    public function index(Request $request, int $walletId)
    {
        $wallet = Wallet::where('user_id', $request->user()->id)->findOrFail($walletId);

        return response()->json($wallet->cards()->get());
    }

    /**
     * Issue a new virtual card on the wallet.
     */
    public function store(Request $request, int $walletId)
    {
        $wallet = Wallet::where('user_id', $request->user()->id)->findOrFail($walletId);

        $validated = $request->validate([
            'type'           => 'in:physical,virtual',
            'spending_limit' => 'nullable|numeric|min:1',
        ]);

        // Generate dummy card details (in production: integrate with card issuer API)
        $card = $wallet->cards()->create([
            'type'           => $validated['type'] ?? 'virtual',
            'last4'          => str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT),
            'expiry_month'   => now()->addYears(3)->month,
            'expiry_year'    => now()->addYears(3)->year,
            'status'         => 'active',
            'spending_limit' => $validated['spending_limit'] ?? null,
        ]);

        return response()->json($card, 201);
    }

    /**
     * Freeze a card.
     */
    public function freeze(Request $request, int $walletId, int $cardId)
    {
        $card = $this->findCard($request, $walletId, $cardId);
        $card->update(['status' => 'frozen']);

        return response()->json($card);
    }

    /**
     * Unfreeze a card.
     */
    public function unfreeze(Request $request, int $walletId, int $cardId)
    {
        $card = $this->findCard($request, $walletId, $cardId);
        $card->update(['status' => 'active']);

        return response()->json($card);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function findCard(Request $request, int $walletId, int $cardId): Card
    {
        $wallet = Wallet::where('user_id', $request->user()->id)->findOrFail($walletId);

        return $wallet->cards()->findOrFail($cardId);
    }
}
