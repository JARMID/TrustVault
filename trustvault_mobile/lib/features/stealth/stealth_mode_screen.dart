import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';

class StealthModeScreen extends StatefulWidget {
  const StealthModeScreen({super.key});

  @override
  State<StealthModeScreen> createState() => _StealthModeScreenState();
}

class _StealthModeScreenState extends State<StealthModeScreen> {
  bool _stealthModeEnabled = true;
  bool _duressPinEnabled = false;

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
          'Stealth & Duress',
          style: TextStyle(fontWeight: FontWeight.w700, letterSpacing: 1),
        ),
      ),
      body: Container(
        color: AppTheme.background,
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              _buildSettingTile(
                title: 'Stealth Mode',
                subtitle:
                    'Obscure balances and sensitive info with a blur overlay when device is tilted or viewed from angles.',
                icon: Icons.visibility_off_outlined,
                color: AppTheme.primary,
                value: _stealthModeEnabled,
                onChanged: (val) {
                  HapticFeedback.selectionClick();
                  setState(() => _stealthModeEnabled = val);
                },
              ),
              const SizedBox(height: 16),
              _buildSettingTile(
                title: 'Duress PIN',
                subtitle:
                    'A decoy PIN that opens a fake low-balance wallet, immediately alerting SOC silently if entered.',
                icon: Icons.key_off_outlined,
                color: AppTheme.danger,
                value: _duressPinEnabled,
                onChanged: (val) {
                  HapticFeedback.selectionClick();
                  setState(() => _duressPinEnabled = val);
                },
              ),
              const SizedBox(height: 24),
              if (_duressPinEnabled) _buildDuressPinConfig(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return GlassContainer(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.danger.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.security, color: AppTheme.danger, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Physical Security',
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Protect against shoulder surfing and physical coercion (wrench attacks).',
                  style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return GlassContainer(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Switch.adaptive(
                value: value,
                onChanged: onChanged,
                activeColor: color,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.only(left: 36, right: 8),
            child: Text(
              subtitle,
              style: const TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 13,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDuressPinConfig() {
    return GlassContainer(
      padding: const EdgeInsets.all(20),
      borderColor: AppTheme.danger.withOpacity(0.4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Configure Duress PIN',
            style: TextStyle(
              color: AppTheme.danger,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
              6,
              (index) => Container(
                width: 44,
                height: 52,
                decoration: BoxDecoration(
                  color: AppTheme.surfaceElevated,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppTheme.danger.withOpacity(0.3)),
                ),
                alignment: Alignment.center,
                child: const Text(
                  '•',
                  style: TextStyle(color: AppTheme.danger, fontSize: 24),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                HapticFeedback.heavyImpact();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.danger.withOpacity(0.2),
                foregroundColor: AppTheme.danger,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: AppTheme.danger.withOpacity(0.5)),
                ),
              ),
              child: const Text(
                'Update Decoy PIN',
                style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
