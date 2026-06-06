<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommunitySignalController;
use App\Http\Controllers\EmergencyLockdownController;
use App\Http\Controllers\FraudAlertController;
use App\Http\Controllers\FraudTriageController;
use App\Http\Controllers\WalletFreezeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — TrustVault
|--------------------------------------------------------------------------
|
| OWASP A05:2021 – Security Misconfiguration:
|   - All routes are explicitly defined (no wildcard or resource discovery)
|   - Rate limiting is enforced on all public endpoints
|   - Auth-required routes use Sanctum middleware
|
| Rate Limits (defined in bootstrap/app.php → RateLimiter):
|   - auth:      5 req/min per IP (login/register — brute-force protection)
|   - emergency: 3 req/min per user (SOS lockdown — prevent abuse)
|   - api:       60 req/min per user (general authenticated endpoints)
|   - public:    30 req/min per IP (unauthenticated endpoints)
|
*/

// ── Public Auth Routes (rate-limited to prevent brute force) ─────────
Route::middleware('throttle:auth')->prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// ── Health Check (for uptime monitors) ──────────────────────────────
Route::middleware('throttle:public')->get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'version' => config('app.version', '1.0.0'),
    ]);
});

// ── Authenticated Routes ─────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // ── Fraud Alerts ────────────────────────────────────────────────
    Route::prefix('fraud-alerts')->group(function () {
        Route::get('/', [FraudAlertController::class, 'index']);
        Route::post('/', [FraudAlertController::class, 'store']);
        Route::get('/{id}', [FraudAlertController::class, 'show'])
            ->where('id', '[0-9]+');
        Route::put('/{id}', [FraudAlertController::class, 'update'])
            ->where('id', '[0-9]+');
        Route::post('/{id}/evidence', [FraudAlertController::class, 'uploadEvidence'])
            ->where('id', '[0-9]+');
    });

    // ── Emergency Lockdown (extra-strict rate limit) ────────────────
    Route::prefix('emergency')->middleware('throttle:emergency')->group(function () {
        Route::post('/lockdown', [EmergencyLockdownController::class, 'activate']);
        Route::post('/{id}/resolve', [EmergencyLockdownController::class, 'resolve'])
            ->where('id', '[0-9]+');
    });
    Route::get('/emergency', [EmergencyLockdownController::class, 'index']);

    // ── Wallet Freeze ───────────────────────────────────────────────
    Route::prefix('wallet-freeze')->group(function () {
        Route::get('/status', [WalletFreezeController::class, 'status']);
        Route::post('/freeze', [WalletFreezeController::class, 'freeze']);
        Route::post('/{id}/unfreeze', [WalletFreezeController::class, 'unfreeze'])
            ->where('id', '[0-9]+');
    });

    // ── Community Signals ────────────────────────────────────────────
    Route::prefix('community')->group(function () {
        Route::get('/signals', [CommunitySignalController::class, 'index']);
        Route::post('/signals', [CommunitySignalController::class, 'store']);
        Route::post('/signals/{id}/confirm', [CommunitySignalController::class, 'confirm'])
            ->where('id', '[0-9]+');
        Route::post('/signals/{id}/moderate', [CommunitySignalController::class, 'moderate'])
            ->where('id', '[0-9]+');
    });

    // ── Fraud Triage (agents/admins only — role checked in controller) ─
    Route::prefix('triage')->group(function () {
        Route::get('/queue', [FraudTriageController::class, 'queue']);
        Route::get('/dashboard', [FraudTriageController::class, 'dashboard']);
        Route::post('/alerts/{id}/action', [FraudTriageController::class, 'action'])
            ->where('id', '[0-9]+');
    });

    // ── Wallet Engine (Layer 1) ─────────────────────────────────────────
    Route::prefix('wallets')->group(function () {
        Route::get('/', [\App\Http\Controllers\WalletController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\WalletController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\WalletController::class, 'show'])->where('id', '[0-9]+');

        // Transactions (deposit / withdrawal)
        Route::get('/{walletId}/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->where('walletId', '[0-9]+');
        Route::post('/{walletId}/transactions', [\App\Http\Controllers\TransactionController::class, 'store'])->where('walletId', '[0-9]+');

        // Cards
        Route::get('/{walletId}/cards', [\App\Http\Controllers\CardController::class, 'index'])->where('walletId', '[0-9]+');
        Route::post('/{walletId}/cards', [\App\Http\Controllers\CardController::class, 'store'])->where('walletId', '[0-9]+');
        Route::post('/{walletId}/cards/{cardId}/freeze', [\App\Http\Controllers\CardController::class, 'freeze'])->where(['walletId' => '[0-9]+', 'cardId' => '[0-9]+']);
        Route::post('/{walletId}/cards/{cardId}/unfreeze', [\App\Http\Controllers\CardController::class, 'unfreeze'])->where(['walletId' => '[0-9]+', 'cardId' => '[0-9]+']);
    });

    // ── P2P Send Money ──────────────────────────────────────────────────
    Route::post('/transfer', [\App\Http\Controllers\TransferController::class, 'send']);
});
