<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * EmergencyLockdown — One-tap wallet & card freeze (SOS).
 *
 * Replaces the legacy PanicEvent with granular freeze controls
 * (cards, wallet, P2P) and support for automated trigger types
 * (velocity rules, geo-anomaly, failed auth cascades).
 */
class EmergencyLockdown extends Model
{
    protected $fillable = [
        'user_id',
        'device_id',
        'trigger_type',
        'latitude',
        'longitude',
        'cards_frozen',
        'wallet_frozen',
        'p2p_disabled',
        'is_resolved',
        'resolved_by',
        'resolution_notes',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'latitude'      => 'decimal:8',
            'longitude'     => 'decimal:8',
            'cards_frozen'  => 'boolean',
            'wallet_frozen' => 'boolean',
            'p2p_disabled'  => 'boolean',
            'is_resolved'   => 'boolean',
            'resolved_at'   => 'datetime',
        ];
    }

    public const TRIGGER_TYPES = [
        'manual',         // User pressed SOS button
        'velocity_rule',  // Too many transactions in short period
        'geo_anomaly',    // Transaction from unusual location
        'failed_auth',    // Multiple failed authentication attempts
    ];

    // ── Relationships ─────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function resolvedByAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function walletFreezes(): HasMany
    {
        return $this->hasMany(WalletFreeze::class);
    }
}
