<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;

/**
 * OWASP A09:2021 – Security Logging and Monitoring Failures
 *
 * Centralized audit logging service. Every security-critical action
 * is recorded with: user, IP, user agent, session ID, device fingerprint,
 * risk level, and contextual metadata.
 *
 * Usage:
 *   AuditService::log('wallet.freeze', 'wallet', $wallet->id, ['reason' => 'user_request'], risk: 'high');
 */
class AuditService
{
    // ── Risk levels ───────────────────────────────────────────────────────────
    public const RISK_LOW      = 'low';
    public const RISK_MEDIUM   = 'medium';
    public const RISK_HIGH     = 'high';
    public const RISK_CRITICAL = 'critical';

    // ── Canonical action constants (prevents typos in call-sites) ─────────────
    // Auth
    public const ACTION_LOGIN_SUCCESS   = 'auth.login.success';
    public const ACTION_LOGIN_FAILED    = 'auth.login.failed';
    public const ACTION_LOGOUT          = 'auth.logout';
    public const ACTION_PASSWORD_RESET  = 'auth.password.reset';
    public const ACTION_2FA_ENABLED     = 'auth.2fa.enabled';
    public const ACTION_2FA_DISABLED    = 'auth.2fa.disabled';
    public const ACTION_SESSION_REVOKED = 'auth.session.revoked';

    // Wallet
    public const ACTION_WALLET_FREEZE    = 'wallet.freeze';
    public const ACTION_WALLET_UNFREEZE  = 'wallet.unfreeze';
    public const ACTION_WALLET_CREATED   = 'wallet.created';
    public const ACTION_TRANSFER_SENT    = 'wallet.transfer.sent';
    public const ACTION_TRANSFER_FAILED  = 'wallet.transfer.failed';

    // Cards
    public const ACTION_CARD_CREATED  = 'card.created';
    public const ACTION_CARD_FROZEN   = 'card.frozen';
    public const ACTION_CARD_DELETED  = 'card.deleted';
    public const ACTION_CARD_LIMIT    = 'card.limit.updated';

    // Security
    public const ACTION_DEVICE_ADDED    = 'device.added';
    public const ACTION_DEVICE_REVOKED  = 'device.revoked';
    public const ACTION_API_KEY_ROTATED = 'api_key.rotated';
    public const ACTION_PANIC           = 'panic.triggered';

    // Admin
    public const ACTION_ADMIN_IMPERSONATE = 'admin.impersonate';
    public const ACTION_ADMIN_ROLE_CHANGE = 'admin.role.changed';
    public const ACTION_EXPORT_DATA       = 'data.export';

    // ── Core log method ───────────────────────────────────────────────────────
    /**
     * @param  string               $action      Canonical action string (use ACTION_* constants)
     * @param  string               $entityType  E.g. 'wallet', 'card', 'user'
     * @param  int|string|null      $entityId    Primary key of the affected entity
     * @param  array<string,mixed>  $metadata    Extra structured context
     * @param  int|null             $userId      Override authenticated user (for async/queued jobs)
     * @param  string               $risk        Risk level: low | medium | high | critical
     */
    public static function log(
        string $action,
        string $entityType,
        int|string|null $entityId = null,
        array $metadata = [],
        ?int $userId = null,
        string $risk = self::RISK_LOW,
    ): AuditLog {
        $request = request();

        return AuditLog::create([
            'user_id'            => $userId ?? auth()->id(),
            'action'             => $action,
            'entity_type'        => $entityType,
            'entity_id'          => $entityId,
            'risk_level'         => $risk,
            'ip_address'         => $request?->ip(),
            'user_agent'         => mb_substr((string) $request?->userAgent(), 0, 512),
            'session_id'         => $request?->session()?->getId(),
            'device_fingerprint' => $request?->header('X-Device-Fingerprint'),
            'geo_country'        => $request?->header('CF-IPCountry'),    // Cloudflare header
            'geo_city'           => $request?->header('CF-IPCity'),
            'metadata'           => $metadata,
        ]);
    }

    // ── Convenience wrappers ──────────────────────────────────────────────────

    /** Log a critical security event and trigger an alert queue job */
    public static function critical(
        string $action,
        string $entityType,
        int|string|null $entityId = null,
        array $metadata = [],
        ?int $userId = null,
    ): AuditLog {
        $log = static::log($action, $entityType, $entityId, $metadata, $userId, self::RISK_CRITICAL);

        // Dispatch alert (implement SecurityAlertJob separately)
        // SecurityAlertJob::dispatch($log)->onQueue('security-alerts');

        return $log;
    }

    /** Retrieve the N most recent audit entries for a given entity */
    public static function historyFor(string $entityType, int|string $entityId, int $limit = 20): \Illuminate\Database\Eloquent\Collection
    {
        return AuditLog::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }
}
