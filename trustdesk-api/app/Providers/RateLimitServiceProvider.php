<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

/**
 * OWASP A04:2021 – Rate Limiting Definitions
 * Centralized rate limiter configuration.
 * IP-based + user-based throttling with graceful 429 responses.
 */
class RateLimitServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // 5 attempts per minute per IP — prevents credential stuffing
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message'     => 'Too many authentication attempts. Please try again later.',
                        'retry_after' => $headers['Retry-After'] ?? 60,
                    ], 429, $headers);
                });
        });

        // 3 PANIC activations per minute per user — prevent abuse
        RateLimiter::for('panic', function (Request $request) {
            return Limit::perMinute(3)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message'     => 'PANIC rate limit exceeded. If this is a real emergency, contact support directly.',
                        'retry_after' => $headers['Retry-After'] ?? 60,
                    ], 429, $headers);
                });
        });

        // 60 requests per minute per authenticated user
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message'     => 'Rate limit exceeded. Please slow down.',
                        'retry_after' => $headers['Retry-After'] ?? 60,
                    ], 429, $headers);
                });
        });

        // 30 requests per minute per IP for unauthenticated endpoints
        RateLimiter::for('public', function (Request $request) {
            return Limit::perMinute(30)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message'     => 'Too many requests.',
                        'retry_after' => $headers['Retry-After'] ?? 60,
                    ], 429, $headers);
                });
        });
    }
}
