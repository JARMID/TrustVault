<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;

/**
 * OWASP A09:2021 – Security Logging and Monitoring
 * Centralized audit logging service. Every security-critical action
 * is recorded with user, IP, user agent, and contextual metadata.
 */
class AuditService
{
    public static function log(
        string $action,
        string $entityType,
        int|string|null $entityId = null,
        array $metadata = [],
        ?int $userId = null,
    ): AuditLog {
        $request = request();

        return AuditLog::create([
            'user_id'     => $userId ?? auth()->id(),
            'action'      => $action,
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'ip_address'  => $request?->ip(),
            'user_agent'  => mb_substr((string) $request?->userAgent(), 0, 512),
            'metadata'    => $metadata,
        ]);
    }
}
