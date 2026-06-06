<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Device extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'device_id',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public const TYPES = ['primary', 'secondary', 'emergency'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
