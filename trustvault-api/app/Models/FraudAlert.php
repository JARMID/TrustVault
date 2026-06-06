<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * FraudAlert — Core financial security entity.
 *
 * Replaces the legacy Incident model with banking-domain
 * terminology, financial metadata (amount, currency, card),
 * and a composite risk-scoring system.
 */
class FraudAlert extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'category',
        'description',
        'amount_involved',
        'currency',
        'transaction_ref',
        'card_last4',
        'latitude',
        'longitude',
        'status',
        'priority',
        'risk_score',
        'assigned_to',
        'resolution_type',
        'resolution_notes',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'amount_involved' => 'decimal:2',
            'latitude'        => 'decimal:8',
            'longitude'       => 'decimal:8',
            'risk_score'      => 'integer',
            'resolved_at'     => 'datetime',
        ];
    }

    // ── Constants ──────────────────────────────────────────

    public const TYPES = [
        'unauthorized_transaction',
        'card_fraud',
        'identity_theft',
        'phishing',
        'dispute',
        'suspicious_activity',
    ];

    public const CATEGORIES = [
        'card', 'wallet', 'p2p', 'merchant', 'account',
    ];

    public const STATUSES = [
        'open', 'investigating', 'escalated', 'resolved', 'closed',
    ];

    public const PRIORITIES = [
        'critical', 'high', 'normal', 'low',
    ];

    public const RESOLUTION_TYPES = [
        'refunded', 'confirmed_fraud', 'false_positive', 'chargeback',
    ];

    // ── Relationships ─────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(FraudAlertEvidence::class);
    }

    public function actions(): HasMany
    {
        return $this->hasMany(AlertAction::class);
    }

    public function walletFreezes(): HasMany
    {
        return $this->hasMany(WalletFreeze::class);
    }

    // ── Risk Scoring ──────────────────────────────────────

    /**
     * Calculate a composite risk score (0–100) based on
     * alert type, priority, and financial exposure.
     */
    public static function calculateRiskScore(
        string $type,
        string $priority,
        ?float $amount = null,
    ): int {
        $typeScores = [
            'unauthorized_transaction' => 40,
            'card_fraud'               => 45,
            'identity_theft'           => 50,
            'phishing'                 => 30,
            'dispute'                  => 20,
            'suspicious_activity'      => 25,
        ];

        $priorityScores = [
            'critical' => 40,
            'high'     => 30,
            'normal'   => 15,
            'low'      => 5,
        ];

        $base = ($typeScores[$type] ?? 20) + ($priorityScores[$priority] ?? 15);

        // High-value transactions boost the score
        if ($amount !== null && $amount > 1000) {
            $base += min(15, (int) ($amount / 1000));
        }

        return min(100, $base);
    }
}
