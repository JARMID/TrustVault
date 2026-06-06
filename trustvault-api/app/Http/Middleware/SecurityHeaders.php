<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * OWASP A05:2021 – Security Misconfiguration
 * Adds critical security headers to every API response.
 * These headers prevent common web attacks at the transport layer.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');

        // XSS protection (legacy, but defense-in-depth)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Strict Transport Security (force HTTPS for 1 year)
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // Prevent caching of sensitive data
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate');
        $response->headers->set('Pragma', 'no-cache');

        // Content Security Policy — API-only (no inline scripts)
        $response->headers->set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");

        // Referrer policy — don't leak URLs cross-origin
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Remove server identification (information disclosure)
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }
}
