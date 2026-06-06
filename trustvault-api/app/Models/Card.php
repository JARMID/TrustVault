<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Card extends Model
{
    protected $fillable = [
        'wallet_id',
        'type',
        'last4',
        'expiry_month',
        'expiry_year',
        'status',
        'spending_limit',
    ];

    protected $casts = [
        'spending_limit' => 'decimal:2',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isFrozen(): bool
    {
        return $this->status === 'frozen';
    }
}
