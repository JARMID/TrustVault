import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';

class VaultScreen extends StatefulWidget {
  const VaultScreen({super.key});

  @override
  State<VaultScreen> createState() => _VaultScreenState();
}

class _VaultScreenState extends State<VaultScreen> {
  bool _isUnlocked = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Zero-Knowledge Vault',
          style: TextStyle(fontWeight: FontWeight.w700, letterSpacing: 1),
        ),
      ),
      body: Container(
        color: AppTheme.background,
        child: SafeArea(
          child: _isUnlocked ? _buildVaultContent() : _buildUnlockScreen(),
        ),
      ),
    );
  }

  Widget _buildUnlockScreen() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.1),
                shape: BoxShape.circle,
                boxShadow: AppTheme.glowShadow(AppTheme.primary),
              ),
              child: const Icon(
                Icons.fingerprint,
                color: AppTheme.primary,
                size: 80,
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'VAULT LOCKED',
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 24,
                fontWeight: FontWeight.w900,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Authenticate to decrypt your secure documents.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
            ),
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  HapticFeedback.heavyImpact();
                  setState(() => _isUnlocked = true);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Authenticate',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVaultContent() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildStorageInfo(),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Encrypted Documents',
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            IconButton(
              icon: const Icon(
                Icons.add_circle_outline,
                color: AppTheme.primary,
              ),
              onPressed: () {
                HapticFeedback.lightImpact();
              },
            ),
          ],
        ),
        const SizedBox(height: 12),
        _buildDocumentTile(
          'Passport Scan',
          'PDF • 2.4 MB • Encrypted',
          Icons.badge_outlined,
        ),
        const SizedBox(height: 12),
        _buildDocumentTile(
          'Tax Returns 2024',
          'PDF • 5.1 MB • Encrypted',
          Icons.receipt_long_outlined,
        ),
        const SizedBox(height: 12),
        _buildDocumentTile(
          'Seed Phrase Backup',
          'TXT • 1 KB • Highly Encrypted',
          Icons.key_outlined,
          isCritical: true,
        ),
      ],
    );
  }

  Widget _buildStorageInfo() {
    return GlassContainer(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                'Secure Storage',
                style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
              ),
              Text(
                '7.5 MB / 1 GB',
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: 0.0075,
            backgroundColor: Colors.white.withOpacity(0.1),
            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primary),
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }

  Widget _buildDocumentTile(
    String title,
    String subtitle,
    IconData icon, {
    bool isCritical = false,
  }) {
    return GlassContainer(
      padding: const EdgeInsets.all(16),
      borderColor: isCritical
          ? AppTheme.danger.withOpacity(0.5)
          : AppTheme.border,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isCritical
                  ? AppTheme.danger.withOpacity(0.15)
                  : AppTheme.primary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: isCritical ? AppTheme.danger : AppTheme.primary,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.download_outlined, color: Colors.white54),
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}
