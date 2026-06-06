<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * Authentication controller — Sanctum token-based auth.
 * OWASP A07:2021 – Identification and Authentication Failures:
 *   - Strong password policy (enforced by RegisterRequest)
 *   - Rate-limited login attempts (enforced by route middleware)
 *   - Generic error messages to prevent user enumeration
 *   - Audit logging on all auth events
 */
class AuthController extends Controller
{
    /**
     * Register a new user account.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => $validated['password'], // auto-hashed via cast
            'role'     => 'client',
            'language' => $validated['language'] ?? 'en',
        ]);

        // Issue a Sanctum token scoped to the user's role
        $token = $user->createToken('auth_token', ['role:client'])->plainTextToken;

        AuditService::log('user.registered', 'user', $user->id, [
            'email' => $user->email,
        ]);

        return response()->json([
            'message' => 'Account created successfully.',
            'user'    => $user->only('id', 'name', 'email', 'role', 'language'),
            'token'   => $token,
        ], 201);
    }

    /**
     * Authenticate and issue a token.
     * Uses generic error message to prevent user enumeration (OWASP).
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (! Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            AuditService::log('auth.failed', 'user', null, [
                'email' => $validated['email'],
            ]);

            // OWASP: Generic message — do NOT reveal if email exists
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $user = Auth::user();

        if (! $user->is_active) {
            Auth::logout();
            return response()->json(['message' => 'Account is deactivated.'], 403);
        }

        // Revoke old tokens (single-session enforcement)
        $user->tokens()->delete();

        $abilities = ["role:{$user->role}"];
        $token = $user->createToken('auth_token', $abilities)->plainTextToken;

        AuditService::log('auth.login', 'user', $user->id);

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user->only('id', 'name', 'email', 'role', 'language'),
            'token'   => $token,
        ]);
    }

    /**
     * Revoke the current token (logout).
     */
    public function logout(): JsonResponse
    {
        $user = auth()->user();
        $user->currentAccessToken()->delete();

        AuditService::log('auth.logout', 'user', $user->id);

        return response()->json(['message' => 'Logged out.']);
    }
}
