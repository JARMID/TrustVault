<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration — OWASP A05:2021
    |--------------------------------------------------------------------------
    |
    | Restrict cross-origin access to only trusted frontend origins.
    | In production, CORS_ALLOWED_ORIGINS should be set to the exact
    | frontend URLs (e.g., "https://app.trustdesk.io,https://admin.trustdesk.io").
    |
    | During development, defaults to localhost:5173 (Vite dev server).
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-XSRF-TOKEN'],

    'exposed_headers' => ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'Retry-After'],

    'max_age' => 86400, // 24 hours — reduce preflight requests

    'supports_credentials' => true,

];
