<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 100);            // e.g. 'auth.login', 'panic.activated'
            $table->string('entity_type', 100);        // e.g. 'incident', 'wallet_freeze'
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('ip_address', 45)->nullable();  // IPv4 or IPv6
            $table->string('user_agent', 512)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();
            // No updated_at — audit logs are immutable

            $table->index(['action', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index('entity_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
