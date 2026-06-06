<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * AlertAction — Agent actions on fraud alerts.
 *
 * Replaces TriageAction with finance-specific actions
 * (refund_initiated, chargeback_filed, freeze_wallet, etc.).
 */
class AlertAction extends Model
{
    protected $fillable = [
        'fraud_alert_id',
        'user_id',  // the agent
        'action',
        'notes',
    ];

    public const ACTIONS = [
        'assigned',
        'escalated',
        'contacted_user',
        'freeze_wallet',
        'unfreeze_wallet',
        'refund_initiated',
        'chargeback_filed',
        'resolved',
        'closed',
    ];

    public function fraudAlert(): BelongsTo
    {
        return $this->belongsTo(FraudAlert::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
