<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Immutable audit log — records all security-critical actions.
 * OWASP: Non-repudiation & accountability.
 */
class AuditLog extends Model
{
    // Audit logs are append-only: no updates allowed.
    public $timestamps = true;
    const UPDATED_AT = null; // Disable updated_at (immutable)

    protected $fillable = [
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
