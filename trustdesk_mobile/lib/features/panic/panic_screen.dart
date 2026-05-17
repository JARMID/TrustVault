import 'dart:ui';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/panic_provider.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';
import '../../shared/bottom_nav.dart';

class PanicScreen extends ConsumerStatefulWidget {
  const PanicScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<PanicScreen> createState() => _PanicScreenState();
}

class _PanicScreenState extends ConsumerState<PanicScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _rotateController;
  late AnimationController _holdController;
  bool _isHolding = false;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _rotateController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat();

    _holdController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    );

    _holdController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _triggerPanic();
      }
    });
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _rotateController.dispose();
    _holdController.dispose();
    super.dispose();
  }

  void _triggerPanic() {
    HapticFeedback.heavyImpact();
    ref.read(panicProvider.notifier).deployPanic();
  }

  void _onHoldStart() {
    HapticFeedback.mediumImpact();
    setState(() => _isHolding = true);
    _holdController.forward(from: 0);
  }

  void _onHoldEnd() {
    setState(() => _isHolding = false);
    _holdController.stop();
    _holdController.reset();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(panicProvider);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'EMERGENCY',
          style: TextStyle(
            color: AppTheme.danger,
            fontWeight: FontWeight.w900,
            letterSpacing: 3,
            fontSize: 18,
          ),
        ),
      ),
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Dark gradient background
          Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.center,
                radius: 1.2,
                colors: [
                  Color(0xFF1A0A0A),
                  AppTheme.backgroundDark,
                ],
              ),
            ),
          ),

          // Animated grid overlay
          Positioned.fill(
            child: CustomPaint(painter: _EmergencyGridPainter()),
          ),

          // Main content
          SafeArea(
            child: Column(
              children: [
                const SizedBox(height: 20),

                if (state.error != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                    child: GlassContainer(
                      padding: const EdgeInsets.all(16),
                      borderColor: AppTheme.danger.withAlpha(60),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline, color: AppTheme.danger, size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              state.error!,
                              style: const TextStyle(color: AppTheme.danger, fontSize: 13),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                const Spacer(),

                if (state.deployed)
                  _buildDeployedState()
                else
                  _buildPanicButton(state.isDeploying, size),

                const Spacer(),

                // Info panel at bottom
                if (!state.deployed)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
                    child: GlassContainer(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Icon(Icons.info_outline, color: AppTheme.textMuted, size: 16),
                              const SizedBox(width: 10),
                              const Text(
                                'Emergency Protocol',
                                style: TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          _buildProtocolItem('Freeze all connected wallets', Icons.account_balance_wallet_outlined),
                          const SizedBox(height: 6),
                          _buildProtocolItem('Broadcast GPS to trusted contacts', Icons.location_on_outlined),
                          const SizedBox(height: 6),
                          _buildProtocolItem('Lock all active sessions remotely', Icons.lock_outline),
                          const SizedBox(height: 6),
                          _buildProtocolItem('Notify security response team', Icons.groups_outlined),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: const CoreBottomNav(currentIndex: 0),
    );
  }

  Widget _buildPanicButton(bool isDeploying, Size size) {
    final buttonSize = size.width * 0.6;

    return AnimatedBuilder(
      animation: Listenable.merge([_pulseController, _rotateController, _holdController]),
      builder: (context, child) {
        final holdProgress = _holdController.value;

        return GestureDetector(
          onLongPressStart: isDeploying ? null : (_) => _onHoldStart(),
          onLongPressEnd: isDeploying ? null : (_) => _onHoldEnd(),
          onLongPressCancel: isDeploying ? null : _onHoldEnd,
          child: SizedBox(
            width: buttonSize + 40,
            height: buttonSize + 40,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Outer rotating ring
                Transform.rotate(
                  angle: _rotateController.value * 2 * math.pi,
                  child: Container(
                    width: buttonSize + 30,
                    height: buttonSize + 30,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppTheme.danger.withAlpha(15),
                        width: 1,
                      ),
                    ),
                    child: Stack(
                      children: [
                        // Tick marks
                        for (int i = 0; i < 12; i++)
                          Positioned.fill(
                            child: Transform.rotate(
                              angle: i * math.pi / 6,
                              child: Align(
                                alignment: Alignment.topCenter,
                                child: Container(
                                  width: 2,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: AppTheme.danger.withAlpha(i % 3 == 0 ? 60 : 20),
                                    borderRadius: BorderRadius.circular(1),
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),

                // Pulse rings
                Container(
                  width: buttonSize + 10 + (30 * _pulseController.value),
                  height: buttonSize + 10 + (30 * _pulseController.value),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppTheme.danger.withAlpha((20 * (1 - _pulseController.value)).toInt()),
                      width: 1,
                    ),
                  ),
                ),

                // Hold progress ring
                if (_isHolding)
                  SizedBox(
                    width: buttonSize + 10,
                    height: buttonSize + 10,
                    child: CircularProgressIndicator(
                      value: holdProgress,
                      strokeWidth: 3,
                      color: AppTheme.danger,
                      backgroundColor: AppTheme.danger.withAlpha(20),
                    ),
                  ),

                // Main button
                Container(
                  width: buttonSize,
                  height: buttonSize,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      center: Alignment(-0.2, -0.3),
                      colors: [
                        AppTheme.danger.withAlpha(_isHolding ? 50 : 25),
                        AppTheme.surface.withAlpha(200),
                      ],
                    ),
                    border: Border.all(
                      color: AppTheme.danger.withAlpha(_isHolding ? 100 : 40),
                      width: _isHolding ? 2 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.danger.withAlpha(
                          _isHolding ? 60 : (15 + (15 * _pulseController.value).toInt()),
                        ),
                        blurRadius: _isHolding ? 50 : 30,
                        spreadRadius: _isHolding ? 10 : 0,
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Center(
                        child: isDeploying
                            ? const CircularProgressIndicator(
                                color: AppTheme.danger,
                                strokeWidth: 3,
                              )
                            : Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    _isHolding ? Icons.warning_rounded : Icons.warning_amber_rounded,
                                    size: 52,
                                    color: _isHolding
                                        ? AppTheme.danger
                                        : AppTheme.textPrimary.withAlpha(180),
                                  ),
                                  const SizedBox(height: 12),
                                  Text(
                                    _isHolding ? 'DEPLOYING...' : 'HOLD TO\nDEPLOY',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontWeight: FontWeight.w900,
                                      fontSize: _isHolding ? 14 : 16,
                                      letterSpacing: 2,
                                      color: _isHolding ? AppTheme.danger : AppTheme.textPrimary,
                                      height: 1.3,
                                    ),
                                  ),
                                ],
                              ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDeployedState() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        children: [
          // Success icon with glow
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppTheme.success.withAlpha(15),
              boxShadow: AppTheme.glowShadow(AppTheme.success, blur: 40),
            ),
            child: const Icon(Icons.check_circle_outline, color: AppTheme.success, size: 56),
          ),
          const SizedBox(height: 28),
          const Text(
            'SIGNAL\nBROADCASTED',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppTheme.accentNeon,
              fontWeight: FontWeight.w900,
              fontSize: 28,
              letterSpacing: 3,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Your coordinates have been securely transmitted to the active response node. Remain in a safe position.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppTheme.textMuted, fontSize: 14, height: 1.5),
          ),
          const SizedBox(height: 40),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: OutlinedButton(
              onPressed: () => ref.read(panicProvider.notifier).reset(),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: AppTheme.accentNeon.withAlpha(60)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                ),
              ),
              child: const Text(
                'DISMISS',
                style: TextStyle(
                  color: AppTheme.accentNeon,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProtocolItem(String text, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: AppTheme.textMuted, size: 16),
        const SizedBox(width: 10),
        Text(text, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
      ],
    );
  }
}

class _EmergencyGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.red.withAlpha(4)
      ..strokeWidth = 0.5;

    const spacing = 30.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
