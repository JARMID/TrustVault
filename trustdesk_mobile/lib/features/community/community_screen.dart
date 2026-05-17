
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';
import '../../shared/bottom_nav.dart';
import '../../core/providers/signal_provider.dart';

class CommunityScreen extends ConsumerStatefulWidget {
  const CommunityScreen({super.key});

  @override
  ConsumerState<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends ConsumerState<CommunityScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _radarPulse;

  @override
  void initState() {
    super.initState();
    _radarPulse = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();
  }

  @override
  void dispose() {
    _radarPulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final signalState = ref.watch(signalProvider);

    int activeCount = 0;
    int suspiciousCount = 0;
    int resolvedCount = 0;

    signalState.whenData((signals) {
      for (var s in signals) {
        if (s.confidenceScore >= 80) {
          resolvedCount++;
        } else if (s.confidenceScore >= 50) {
          suspiciousCount++;
        } else {
          activeCount++;
        }
      }
    });

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text(
          'Community Radar',
          style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 0.5),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.map_outlined, color: AppTheme.textSecondary),
            onPressed: () => HapticFeedback.lightImpact(),
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.textSecondary),
            onPressed: () {
              HapticFeedback.lightImpact();
              ref.read(signalProvider.notifier).fetchSignals();
            },
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topLeft,
            radius: 2.0,
            colors: [Color(0xFF0D1B2A), AppTheme.backgroundDark],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Radar Visual Banner
                _buildRadarBanner(),
                const SizedBox(height: 20),

                // Threat Level Stats
                Row(
                  children: [
                    Expanded(child: _buildThreatStat('Active', activeCount, AppTheme.danger)),
                    const SizedBox(width: 10),
                    Expanded(child: _buildThreatStat('Suspicious', suspiciousCount, AppTheme.warning)),
                    const SizedBox(width: 10),
                    Expanded(child: _buildThreatStat('Resolved', resolvedCount, AppTheme.success)),
                  ],
                ),

                const SizedBox(height: 24),

                // Nearby Signals Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'NEARBY SIGNALS',
                      style: TextStyle(
                        color: AppTheme.textMuted,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.5,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withAlpha(15),
                        borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                        border: Border.all(color: AppTheme.primary.withAlpha(30)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.location_on_outlined, size: 12, color: AppTheme.primary),
                          SizedBox(width: 4),
                          Text('5km radius', style: TextStyle(color: AppTheme.primary, fontSize: 10, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Signal Feed
                signalState.when(
                  data: (signals) {
                    if (signals.isEmpty) {
                      return _buildEmptyState();
                    }
                    return Column(
                      children: signals.map((signal) {
                        final threatColor = _getThreatColor(signal.confidenceScore);
                        final threatLevel = _getThreatLevel(signal.confidenceScore);

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: GlassContainer(
                            onTap: () => HapticFeedback.lightImpact(),
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 42,
                                      height: 42,
                                      decoration: BoxDecoration(
                                        color: threatColor.withAlpha(15),
                                        borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                                      ),
                                      child: Icon(
                                        _getSignalIcon(signal.type),
                                        color: threatColor,
                                        size: 20,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            signal.type.toUpperCase(),
                                            style: const TextStyle(
                                              fontWeight: FontWeight.w700,
                                              fontSize: 14,
                                              color: AppTheme.textPrimary,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            signal.description,
                                            style: const TextStyle(
                                              color: AppTheme.textMuted,
                                              fontSize: 12,
                                            ),
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                // Confidence bar + threat level
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                  decoration: BoxDecoration(
                                    color: AppTheme.surfaceElevated,
                                    borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                                  ),
                                  child: Row(
                                    children: [
                                      Text(
                                        threatLevel,
                                        style: TextStyle(
                                          color: threatColor,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: ClipRRect(
                                          borderRadius: BorderRadius.circular(4),
                                          child: LinearProgressIndicator(
                                            value: signal.confidenceScore / 100,
                                            minHeight: 4,
                                            backgroundColor: AppTheme.border,
                                            valueColor: AlwaysStoppedAnimation(threatColor),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Text(
                                        '${signal.confidenceScore}%',
                                        style: TextStyle(
                                          color: threatColor,
                                          fontSize: 14,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    );
                  },
                  loading: () => const Padding(
                    padding: EdgeInsets.only(top: 60),
                    child: Center(child: CircularProgressIndicator(color: AppTheme.primary, strokeWidth: 2)),
                  ),
                  error: (err, _) => Center(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 60),
                      child: Column(
                        children: [
                          const Icon(Icons.error_outline, color: AppTheme.danger, size: 48),
                          const SizedBox(height: 12),
                          Text('Failed to load signals', style: TextStyle(color: AppTheme.danger)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: const CoreBottomNav(currentIndex: 3),
    );
  }

  Widget _buildRadarBanner() {
    return AnimatedBuilder(
      animation: _radarPulse,
      builder: (context, child) {
        return GlassContainer(
          padding: const EdgeInsets.all(24),
          borderColor: AppTheme.primary.withAlpha(25),
          child: Row(
            children: [
              SizedBox(
                width: 56,
                height: 56,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Pulse ring
                    Container(
                      width: 56 * _radarPulse.value,
                      height: 56 * _radarPulse.value,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppTheme.primary.withAlpha((40 * (1 - _radarPulse.value)).toInt()),
                          width: 1,
                        ),
                      ),
                    ),
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.primary.withAlpha(15),
                      ),
                      child: const Icon(Icons.radar, color: AppTheme.primary, size: 22),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Live Threat Radar',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Analyzing global incident reports from the community network',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 12, height: 1.3),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildThreatStat(String label, int value, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
      child: Column(
        children: [
          Text(
            '$value',
            style: TextStyle(color: color, fontSize: 22, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Padding(
      padding: const EdgeInsets.only(top: 60),
      child: Center(
        child: Column(
          children: [
            Icon(Icons.verified_user_outlined, color: AppTheme.success.withAlpha(60), size: 64),
            const SizedBox(height: 16),
            const Text(
              'All clear',
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 4),
            const Text(
              'No active threats in your radius',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  Color _getThreatColor(int confidence) {
    if (confidence >= 80) return AppTheme.success;
    if (confidence >= 50) return AppTheme.warning;
    return AppTheme.danger;
  }

  String _getThreatLevel(int confidence) {
    if (confidence >= 80) return 'RESOLVED';
    if (confidence >= 50) return 'SUSPICIOUS';
    return 'ACTIVE';
  }

  IconData _getSignalIcon(String type) {
    switch (type.toLowerCase()) {
      case 'phishing':
        return Icons.phishing_outlined;
      case 'malware':
        return Icons.bug_report_outlined;
      case 'intrusion':
        return Icons.login_outlined;
      case 'ddos':
        return Icons.cloud_off_outlined;
      default:
        return Icons.wifi_tethering_error_rounded;
    }
  }
}
