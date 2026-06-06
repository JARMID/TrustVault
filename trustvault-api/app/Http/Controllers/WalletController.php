<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * Display a listing of the user's wallets.
     */
    public function index(Request $request)
    {
        $wallets = Wallet::where('user_id', $request->user()->id)->get();
        return response()->json($wallets);
    }

    /**
     * Store a newly created wallet.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'currency' => 'string|size:3',
        ]);

        $wallet = Wallet::create([
            'user_id' => $request->user()->id,
            'balance' => 0,
            'currency' => $validated['currency'] ?? 'USD',
            'status' => 'active',
        ]);

        return response()->json($wallet, 201);
    }

    /**
     * Display the specified wallet.
     */
    public function show(Request $request, $id)
    {
        $wallet = Wallet::where('user_id', $request->user()->id)->findOrFail($id);
        return response()->json($wallet);
    }
}
