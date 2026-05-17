
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';
import '../../shared/bottom_nav.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _shieldPulse;

  @override
  void initState() {
    super.initState();
    _shieldPulse = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _shieldPulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.shield_rounded, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            const Text(
              'TrustDesk',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                fontSize: 20,
              ),
            ),
          ],
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined, color: AppTheme.textSecondary),
                onPressed: () => HapticFeedback.lightImpact(),
              ),
              Positioned(
                right: 10,
                top: 10,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: AppTheme.danger,
                    shape: BoxShape.circle,
                    boxShadow: AppTheme.glowShadow(AppTheme.danger, blur: 8),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topRight,
            radius: 2.0,
            colors: [
              Color(0xFF1A2744),
              AppTheme.backgroundDark,
              AppTheme.backgroundDark,
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Protection Status Banner
                _buildProtectionBanner(),
                const SizedBox(height: 24),

                // Quick Stats Row
                _buildQuickStats(),
                const SizedBox(height: 24),

                // Panic Button
                _buildPanicButton(context),
                const SizedBox(height: 20),

                // Action Grid
                _buildActionGrid(context),
                const SizedBox(height: 24),

                // Live Feed Section
                _buildLiveFeedHeader(),
                const SizedBox(height: 12),
                _buildLiveFeedItems(),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: const CoreBottomNav(currentIndex: 1),
    );
  }

  Widget _buildProtectionBanner() {
    return AnimatedBuilder(
      animation: _shieldPulse,
      builder: (context, child) {
        return GlassContainer(
          padding: const EdgeInsets.all(20),
          borderColor: AppTheme.success.withAlpha(30 + (20 * _shieldPulse.value).toInt()),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: AppTheme.success.withAlpha(15),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.success.withAlpha((30 * _shieldPulse.value).toInt()),
                      blurRadius: 20,
                    ),
                  ],
                ),
                child: const Icon(Icons.shield_rounded, color: AppTheme.success, size: 26),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: AppTheme.success,
                            shape: BoxShape.circle,
                            boxShadow: AppTheme.glowShadow(AppTheme.success, blur: 8),
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'PROTECTION ACTIVE',
                          style: TextStyle(
                            color: AppTheme.success,
                            fontWeight: FontWeight.w700,
                            fontSize: 13,
                            letterSpacing: 1,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'All endpoints secured • Last scan 4 min ago',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
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

  Widget _buildQuickStats() {
    return Row(
      children: [
        Expanded(child: _buildMiniStat('Threats\nBlocked', '247', AppTheme.danger)),
        const SizedBox(width: 12),
        Expanded(child: _buildMiniStat('Devices\nSecured', '12', AppTheme.primary)),
        const SizedBox(width: 12),
        Expanded(child: _buildMiniStat('Uptime', '99.9%', AppTheme.success)),
      ],
    );
  }

  Widget _buildMiniStat(String label, String value, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 24,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppTheme.textMuted,
              fontSize: 11,
              height: 1.3,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPanicButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.heavyImpact();
        context.push('/panic');
      },
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppTheme.danger.withAlpha(30),
              AppTheme.danger.withAlpha(10),
            ],
          ),
          borderRadius: BorderRadius.circular(AppTheme.radiusXl),
          border: Border.all(color: AppTheme.danger.withAlpha(80), width: 1.5),
          boxShadow: [
            BoxShadow(color: AppTheme.danger.withAlpha(30), blurRadius: 30, spreadRadius: 0),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppTheme.danger.withAlpha(25),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.warning_amber_rounded, size: 32, color: AppTheme.danger),
            ),
            const SizedBox(width: 16),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'TRIGGER PANIC',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Freeze wallets & notify contacts',
                    style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: AppTheme.danger.withAlpha(150), size: 28),
          ],
        ),
      ),
    );
  }

  Widget _buildActionGrid(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildActionCard(
            context,
            Icons.radar,
            'Community\nRadar',
            'Live threats nearby',
            AppTheme.primary,
            '/community',
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionCard(
            context,
            Icons.add_moderator_outlined,
            'Report\nIncident',
            'Submit new ticket',
            AppTheme.warning,
            '/incidents',
          ),
        ),
      ],
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    Color color,
    String route,
  ) {
    return GlassContainer(
      onTap: () {
        HapticFeedback.lightImpact();
        context.push(route);
      },
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color.withAlpha(15),
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(height: 14),
          Text(
            title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppTheme.textPrimary,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildLiveFeedHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'LIVE FEED',
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
            color: AppTheme.success.withAlpha(15),
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
            border: Border.all(color: AppTheme.success.withAlpha(40)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: const BoxDecoration(
                  color: AppTheme.success,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              const Text(
                'LIVE',
                style: TextStyle(
                  color: AppTheme.success,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildLiveFeedItems() {
    final feedItems = [
      _FeedItem('API key rotated successfully', 'Production Environment', '2 min ago', Icons.vpn_key_outlined, AppTheme.primary),
      _FeedItem('Suspicious login attempt blocked', 'IP: 185.xxx.xxx.42', '8 min ago', Icons.block_outlined, AppTheme.danger),
      _FeedItem('Incident #2847 auto-resolved', 'Low severity – Duplicate', '14 min ago', Icons.check_circle_outline, AppTheme.success),
      _FeedItem('Community signal received', 'Zone B – Elevated threat', '23 min ago', Icons.wifi_tethering_rounded, AppTheme.warning),
    ];

    return Column(
      children: feedItems.map((item) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: GlassContainer(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: item.color.withAlpha(15),
                    borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                  ),
                  child: Icon(item.icon, color: item.color, size: 20),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.title,
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        item.subtitle,
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                Text(
                  item.time,
                  style: const TextStyle(color: AppTheme.textDisabled, fontSize: 11),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _FeedItem {
  final String title;
  final String subtitle;
  final String time;
  final IconData icon;
  final Color color;

  const _FeedItem(this.title, this.subtitle, this.time, this.icon, this.color);
}
