<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request and set the correct application language
     * based on the Accept-Language header.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Prioritize forced language header for TrustDesk requests.
        $locale = $request->header('X-App-Locale');

        // 2. Fall back to standard Accept-Language content negotiation
        if (!$locale) {
            $locale = $request->getPreferredLanguage(['en', 'fr', 'ar']);
        }

        // 3. Ensure the locale is allowed (fallback to 'en')
        if (in_array($locale, ['en', 'fr', 'ar'])) {
            App::setLocale($locale);
        } else {
            App::setLocale('en');
        }

        return $next($request);
    }
}
