<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WalletFreeze — Security holds on user wallets/cards.
 *
 * Replaces CampusRestriction with financial freeze semantics.
 * Supports scoped freezes (full, card-only, P2P-only, withdrawal-only)
 * to minimize user disruption while maintaining security.
 */
class WalletFreeze extends Model
{
    protected $table = 'wallet_freezes';

    protected $fillable = [
        'user_id',
        'fraud_alert_id',
        'emergency_lockdown_id',
        'scope',
        'status',
        'is_manual_override',
        'action_by',
        'reason',
        'frozen_at',
        'unfrozen_at',
    ];

    protected function casts(): array
    {
        return [
            'is_manual_override' => 'boolean',
            'frozen_at'          => 'datetime',
            'unfrozen_at'        => 'datetime',
        ];
    }

    public const SCOPES = ['full', 'card_only', 'p2p_only', 'withdrawal_only'];
    public const STATUSES = ['frozen', 'active', 'pending_unfreeze'];

    // ── Relationships ─────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fraudAlert(): BelongsTo
    {
        return $this->belongsTo(FraudAlert::class);
    }

    public function emergencyLockdown(): BelongsTo
    {
        return $this->belongsTo(EmergencyLockdown::class);
    }

    public function actionByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'action_by');
    }
}
