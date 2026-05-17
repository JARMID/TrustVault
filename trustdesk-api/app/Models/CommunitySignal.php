<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommunitySignal extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'latitude',
        'longitude',
        'confidence_score',
        'is_verified',
        'is_false_positive',
        'moderated_by',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'confidence_score' => 'integer',
            'is_verified' => 'boolean',
            'is_false_positive' => 'boolean',
        ];
    }

    public const TYPES = ['suspicious_activity', 'theft_spotted', 'lost_device', 'scam_attempt'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }
}
