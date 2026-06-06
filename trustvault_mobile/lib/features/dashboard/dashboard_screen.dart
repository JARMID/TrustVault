import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';
import '../../shared/bottom_nav.dart';
import '../../core/providers/wallet_provider.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _shieldPulse;
  late AnimationController _entranceController;

  @override
  void initState() {
    super.initState();
    _shieldPulse = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..forward();
  }

  @override
  void dispose() {
    _shieldPulse.dispose();
    _entranceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final walletState = ref.watch(walletProvider);

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
                color: AppTheme.primary.withAlpha(20),
                border: Border.all(color: AppTheme.primary.withAlpha(50)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.shield_rounded,
                color: AppTheme.primary,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'TrustVault',
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
                icon: const Icon(
                  Icons.notifications_outlined,
                  color: AppTheme.textSecondary,
                ),
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
        color: AppTheme.background,
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildAnimatedElement(0.0, _buildProtectionBanner()),
                const SizedBox(height: 24),
                _buildAnimatedElement(0.2, _buildQuickStats(walletState)),
                const SizedBox(height: 24),
                _buildAnimatedElement(0.3, _buildPanicButton(context)),
                const SizedBox(height: 20),
                _buildAnimatedElement(0.4, _buildActionGrid(context)),
                const SizedBox(height: 24),
                _buildAnimatedElement(0.6, _buildLiveFeedHeader()),
                const SizedBox(height: 12),
                _buildAnimatedElement(0.7, _buildLiveFeedItems()),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: const CoreBottomNav(currentIndex: 1),
    );
  }

  // ── Protection Banner ─────────────────────────────────────────────────────

  Widget _buildProtectionBanner() {
    return AnimatedBuilder(
      animation: _shieldPulse,
      builder: (context, child) {
        return GlassContainer(
          padding: const EdgeInsets.all(20),
          borderColor: AppTheme.success.withAlpha(
            50 + (30 * _shieldPulse.value).toInt(),
          ),
          backgroundColor: AppTheme.success.withAlpha(10),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: AppTheme.success.withAlpha(20),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppTheme.success.withAlpha(40)),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.success.withAlpha(
                        (20 * _shieldPulse.value).toInt(),
                      ),
                      blurRadius: 15,
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.shield_rounded,
                  color: AppTheme.success,
                  size: 26,
                ),
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
                            boxShadow: AppTheme.glowShadow(
                              AppTheme.success,
                              blur: 8,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'PROTECTION ACTIVE',
                          style: TextStyle(
                            color: AppTheme.success,
                            fontWeight: FontWeight.w800,
                            fontSize: 13,
                            letterSpacing: 1,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'All endpoints secured • Last scan 4 min ago',
                      style: TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
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

  // ── Quick Stats ───────────────────────────────────────────────────────────

  Widget _buildQuickStats(WalletState walletState) {
    final balance = walletState.totalBalance;
    final activeCards = walletState.cards
        .where((c) => c.status == 'active')
        .length;

    return Row(
      children: [
        Expanded(
          child: _buildMiniStat(
            'Total\nBalance',
            '${balance.toStringAsFixed(0)} DZD',
            AppTheme.primary,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildMiniStat(
            'Active\nCards',
            '$activeCards',
            AppTheme.success,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildMiniStat('Threats\nBlocked', '247', AppTheme.danger),
        ),
      ],
    );
  }

  Widget _buildMiniStat(String label, String value, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      child: Column(
        children: [
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: color,
              fontSize: 18,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppTheme.textSecondary,
              fontSize: 11,
              height: 1.3,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  // ── Panic Button ──────────────────────────────────────────────────────────

  Widget _buildPanicButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.heavyImpact();
        context.push('/panic');
      },
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppTheme.danger.withAlpha(10),
          borderRadius: BorderRadius.circular(AppTheme.radiusXl),
          border: Border.all(color: AppTheme.danger.withAlpha(40), width: 1.5),
          boxShadow: [
            BoxShadow(color: AppTheme.danger.withAlpha(15), blurRadius: 20),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppTheme.danger.withAlpha(20),
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.danger.withAlpha(30)),
              ),
              child: const Icon(
                Icons.warning_amber_rounded,
                size: 32,
                color: AppTheme.danger,
              ),
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
                      color: AppTheme.danger,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Freeze wallets & notify contacts',
                    style: TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: AppTheme.danger.withAlpha(150),
              size: 28,
            ),
          ],
        ),
      ),
    );
  }

  // ── Action Grid ───────────────────────────────────────────────────────────

  Widget _buildActionGrid(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _ActionCard3D(
                icon: Icons.radar,
                title: 'Community\nRadar',
                subtitle: 'Live threats nearby',
                color: AppTheme.primary,
                route: '/community',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _ActionCard3D(
                icon: Icons.add_moderator_outlined,
                title: 'Report\nIncident',
                subtitle: 'Submit new ticket',
                color: AppTheme.warning,
                route: '/incidents',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _ActionCard3D(
                icon: Icons.gps_fixed_rounded,
                title: 'AR Secure\nATM Locator',
                subtitle: 'Find safe ATMs',
                color: AppTheme.success,
                route: '/ar-atm',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _ActionCard3D(
                icon: Icons.wifi_tethering_rounded,
                title: 'Offline P2P\nHandshake',
                subtitle: 'Transfer without net',
                color: const Color(0xFF00C6AE),
                route: '/p2p',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _ActionCard3D(
                icon: Icons.fingerprint_rounded,
                title: 'Zero-Knowledge\nVault',
                subtitle: 'Encrypted docs',
                color: const Color(0xFF8B5CF6),
                route: '/vault',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _ActionCard3D(
                icon: Icons.send_rounded,
                title: 'Send\nMoney',
                subtitle: 'P2P transfer',
                color: AppTheme.info,
                route: '/send',
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ── Live Feed ─────────────────────────────────────────────────────────────

  Widget _buildLiveFeedHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'LIVE FEED',
          style: TextStyle(
            color: AppTheme.textSecondary,
            fontSize: 12,
            fontWeight: FontWeight.w800,
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
                  fontWeight: FontWeight.w800,
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
      _FeedItem(
        'API key rotated successfully',
        'Production Environment',
        '2 min ago',
        Icons.vpn_key_outlined,
        AppTheme.primary,
      ),
      _FeedItem(
        'Suspicious login attempt blocked',
        'IP: 185.xxx.xxx.42',
        '8 min ago',
        Icons.block_outlined,
        AppTheme.danger,
      ),
      _FeedItem(
        'Incident #2847 auto-resolved',
        'Low severity – Duplicate',
        '14 min ago',
        Icons.check_circle_outline,
        AppTheme.success,
      ),
      _FeedItem(
        'Community signal received',
        'Zone B – Elevated threat',
        '23 min ago',
        Icons.wifi_tethering_rounded,
        AppTheme.warning,
      ),
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
                    border: Border.all(color: item.color.withAlpha(30)),
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
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        item.subtitle,
                        style: const TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  item.time,
                  style: const TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  // ── Entrance animation helper ─────────────────────────────────────────────

  Widget _buildAnimatedElement(double startDelay, Widget child) {
    final animation = CurvedAnimation(
      parent: _entranceController,
      curve: Interval(startDelay, 1.0, curve: Curves.easeOutCubic),
    );
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Opacity(
          opacity: animation.value,
          child: Transform.translate(
            offset: Offset(0, 30 * (1 - animation.value)),
            child: child,
          ),
        );
      },
      child: child,
    );
  }
}

// ── 3D Tilt Action Card ───────────────────────────────────────────────────────

class _ActionCard3D extends StatefulWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final String route;

  const _ActionCard3D({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.route,
  });

  @override
  State<_ActionCard3D> createState() => _ActionCard3DState();
}

class _ActionCard3DState extends State<_ActionCard3D>
    with SingleTickerProviderStateMixin {
  late AnimationController _tiltController;
  Offset _tilt = Offset.zero;

  @override
  void initState() {
    super.initState();
    _tiltController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
    );
  }

  @override
  void dispose() {
    _tiltController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (details) {
        final box = context.findRenderObject() as RenderBox;
        final local = box.globalToLocal(details.globalPosition);
        final hw = box.size.width / 2;
        final hh = box.size.height / 2;
        setState(() {
          _tilt = Offset((local.dy - hh) / hh, -(local.dx - hw) / hw);
        });
        _tiltController.forward(from: 0);
      },
      onTapUp: (_) {
        _tiltController.reverse();
        HapticFeedback.lightImpact();
        context.push(widget.route);
      },
      onTapCancel: () => _tiltController.reverse(),
      child: AnimatedBuilder(
        animation: _tiltController,
        builder: (context, child) {
          final s = 1.0 - (0.02 * _tiltController.value);
          final matrix = Matrix4.identity()
            ..setEntry(3, 2, 0.002)
            ..rotateX(_tilt.dx * 0.1 * _tiltController.value)
            ..rotateY(_tilt.dy * 0.1 * _tiltController.value)
            ..scale(s, s, s);

          return Transform(
            transform: matrix,
            alignment: FractionalOffset.center,
            child: GlassContainer(
              padding: const EdgeInsets.all(20),
              backgroundColor: widget.color.withAlpha(5),
              borderColor: widget.color.withAlpha(30),
              boxShadow: [
                BoxShadow(
                  color: widget.color.withAlpha(10),
                  blurRadius: 15,
                  offset: const Offset(0, 4),
                ),
              ],
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: widget.color.withAlpha(15),
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                      border: Border.all(color: widget.color.withAlpha(30)),
                    ),
                    child: Icon(widget.icon, color: widget.color, size: 22),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    widget.title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.textPrimary,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.subtitle,
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

// ── Feed Item Model ───────────────────────────────────────────────────────────

class _FeedItem {
  final String title;
  final String subtitle;
  final String time;
  final IconData icon;
  final Color color;

  const _FeedItem(this.title, this.subtitle, this.time, this.icon, this.color);
}
