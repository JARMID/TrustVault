<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'balance',
        'currency',
        'status',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'spending_limit' => 'decimal:2',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isFrozen(): bool
    {
        return $this->status === 'frozen';
    }

    /**
     * Debit the wallet atomically. Returns false if insufficient funds.
     */
    public function debit(float $amount): bool
    {
        if ($this->balance < $amount || $this->isFrozen()) {
            return false;
        }

        $this->decrement('balance', $amount);

        return true;
    }

    /**
     * Credit the wallet atomically.
     */
    public function credit(float $amount): void
    {
        $this->increment('balance', $amount);
    }
}
