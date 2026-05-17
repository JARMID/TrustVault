<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders([
        App\Providers\RateLimitServiceProvider::class,
    ])
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        /*
         * OWASP A05:2021 – Security Misconfiguration
         * Sanctum stateful middleware for API token authentication.
         */
        $middleware->statefulApi();

        /*
         * Register security headers middleware globally for API routes.
         * Register SetLocale to handle cross-platform internationalization (en, fr, ar).
         */
        $middleware->api(prepend: [
            \App\Http\Middleware\SecurityHeaders::class,
            \App\Http\Middleware\SetLocale::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
         * OWASP A09:2021 – Security Logging and Monitoring
         * Graceful 429 error responses for rate-limited requests.
         */
        $exceptions->renderable(function (TooManyRequestsHttpException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message'     => 'Rate limit exceeded.',
                    'retry_after' => $e->getHeaders()['Retry-After'] ?? 60,
                ], 429, $e->getHeaders());
            }
        });
    })->create();
