<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Transaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'type',
        'amount',
        'currency',
        'status',
        'reference',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    // Auto-generate reference on creation
    protected static function booted(): void
    {
        static::creating(function (Transaction $tx) {
            if (empty($tx->reference)) {
                $tx->reference = 'TXN-' . strtoupper(Str::random(10));
            }
        });
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }
}
