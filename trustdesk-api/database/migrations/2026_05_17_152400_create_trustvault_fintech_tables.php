<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * TrustVault FinTech Domain Migration
 *
 * Creates the core financial-security tables that replace the legacy
 * campus-management schema. Legacy tables are preserved for backward
 * compatibility during the transition period.
 *
 * New tables:
 *   - fraud_alerts          (replaces incidents)
 *   - fraud_alert_evidence  (replaces incident_evidence)
 *   - emergency_lockdowns   (replaces panic_events)
 *   - wallet_freezes_v2     (replaces campus_restrictions)
 *   - alert_actions         (replaces triage_actions)
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Fraud Alerts (replaces Incidents) ──────────────────────
        Schema::create('fraud_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('type');          // unauthorized_transaction, card_fraud, identity_theft, phishing, dispute, suspicious_activity
            $table->string('category')->nullable(); // card, wallet, p2p, merchant, account
            $table->text('description')->nullable();
            $table->decimal('amount_involved', 15, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->string('transaction_ref')->nullable(); // linked transaction reference
            $table->string('card_last4', 4)->nullable();   // affected card

            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            $table->string('status')->default('open');     // open, investigating, escalated, resolved, closed
            $table->string('priority')->default('normal'); // critical, high, normal, low
            $table->integer('risk_score')->default(0);     // 0-100 composite risk score

            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('resolution_type')->nullable(); // refunded, confirmed_fraud, false_positive, chargeback
            $table->text('resolution_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'priority']);
            $table->index('risk_score');
        });

        // ── Fraud Alert Evidence ───────────────────────────────────
        Schema::create('fraud_alert_evidence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fraud_alert_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('file_type');
            $table->string('file_name');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ── Emergency Lockdowns (replaces PanicEvents) ────────────
        Schema::create('emergency_lockdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('device_id')->nullable()->constrained('devices')->nullOnDelete();

            $table->string('trigger_type')->default('manual'); // manual, velocity_rule, geo_anomaly, failed_auth
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            $table->boolean('cards_frozen')->default(true);
            $table->boolean('wallet_frozen')->default(true);
            $table->boolean('p2p_disabled')->default(true);

            $table->boolean('is_resolved')->default(false);
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('resolution_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'is_resolved']);
        });

        // ── Wallet Freezes (replaces CampusRestrictions) ───────
        Schema::create('wallet_freezes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('fraud_alert_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('emergency_lockdown_id')->nullable()->constrained()->nullOnDelete();

            $table->string('scope')->default('full'); // full, card_only, p2p_only, withdrawal_only
            $table->string('status')->default('frozen'); // frozen, active, pending_unfreeze
            $table->boolean('is_manual_override')->default(false);
            $table->foreignId('action_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('reason')->nullable();

            $table->timestamp('frozen_at')->nullable();
            $table->timestamp('unfrozen_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        // ── Alert Actions (replaces TriageActions) ────────────────
        Schema::create('alert_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fraud_alert_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // the agent
            $table->string('action'); // assigned, escalated, contacted_user, freeze_wallet, unfreeze_wallet, refund_initiated, chargeback_filed, resolved, closed
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alert_actions');
        Schema::dropIfExists('wallet_freezes');
        Schema::dropIfExists('emergency_lockdowns');
        Schema::dropIfExists('fraud_alert_evidence');
        Schema::dropIfExists('fraud_alerts');
    }
};
