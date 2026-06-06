<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * FraudAlertEvidence — Supporting documents for fraud investigations.
 * Replaces IncidentEvidence with identical file-handling semantics.
 */
class FraudAlertEvidence extends Model
{
    protected $table = 'fraud_alert_evidence';

    protected $fillable = [
        'fraud_alert_id',
        'file_path',
        'file_type',
        'file_name',
        'notes',
    ];

    public function fraudAlert(): BelongsTo
    {
        return $this->belongsTo(FraudAlert::class);
    }
}
