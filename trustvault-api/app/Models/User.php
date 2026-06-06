<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User model — supports Sanctum token auth, role-based access,
 * and relationships to all user-owned security & financial entities.
 *
 * Role System (TrustVault FinTech):
 *   - admin              : Full platform control
 *   - fraud_analyst      : Triage fraud alerts, freeze wallets (replaces security_dispatch)
 *   - compliance_officer : Regulatory review, dispute resolution (replaces title_ix_coordinator)
 *   - client             : Standard wallet user (replaces student/faculty/staff)
 *
 * Legacy roles are still accepted for backward compatibility during migration.
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',       // admin | fraud_analyst | compliance_officer | client
        'language',   // fr | en | ar
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // ── Relationships (FinTech) ────────────────────────────

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }

    public function fraudAlerts(): HasMany
    {
        return $this->hasMany(FraudAlert::class);
    }

    public function emergencyLockdowns(): HasMany
    {
        return $this->hasMany(EmergencyLockdown::class);
    }

    public function walletFreezes(): HasMany
    {
        return $this->hasMany(WalletFreeze::class);
    }

    public function communitySignals(): HasMany
    {
        return $this->hasMany(CommunitySignal::class);
    }

    public function trustedContacts(): HasMany
    {
        return $this->hasMany(TrustedContact::class);
    }


    // ── Helpers ─────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user has agent-level access (can triage alerts, freeze wallets).
     * Accepts both new FinTech roles and legacy roles for backward compatibility.
     */
    public function isAgent(): bool
    {
        return in_array($this->role, [
            'admin',
            'fraud_analyst',
            'compliance_officer',
            // Legacy roles (backward compat)
            'security_dispatch',
            'title_ix_coordinator',
        ]);
    }
}
