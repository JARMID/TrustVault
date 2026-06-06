import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';

class P2PHandshakeScreen extends StatefulWidget {
  const P2PHandshakeScreen({super.key});

  @override
  State<P2PHandshakeScreen> createState() => _P2PHandshakeScreenState();
}

class _P2PHandshakeScreenState extends State<P2PHandshakeScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _radarController;
  int _searchStage =
      0; // 0 = Searching, 1 = Found Peer, 2 = Handshake/Transfer, 3 = Complete

  @override
  void initState() {
    super.initState();
    _radarController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    _simulateDiscoveryFlow();
  }

  void _simulateDiscoveryFlow() async {
    await Future.delayed(const Duration(seconds: 3));
    if (!mounted) return;
    setState(() => _searchStage = 1);
    HapticFeedback.mediumImpact();

    await Future.delayed(const Duration(seconds: 3));
    if (!mounted) return;
    setState(() => _searchStage = 2);
    HapticFeedback.lightImpact();

    await Future.delayed(const Duration(seconds: 2));
    if (!mounted) return;
    setState(() => _searchStage = 3);
    HapticFeedback.heavyImpact();
    _radarController.stop();
  }

  @override
  void dispose() {
    _radarController.dispose();
    super.dispose();
  }

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
          'Offline P2P Transfer',
          style: TextStyle(
            fontWeight: FontWeight.w700,
            letterSpacing: 1,
            color: AppTheme.textPrimary,
          ),
        ),
      ),
      body: Container(
        color: AppTheme.background,
        child: SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildRadar(),
              const SizedBox(height: 48),
              _buildStatusText(),
              const SizedBox(height: 32),
              if (_searchStage >= 1) _buildPeerCard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRadar() {
    return SizedBox(
      height: 250,
      width: 250,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Ripple circles
          ...List.generate(3, (index) {
            return AnimatedBuilder(
              animation: _radarController,
              builder: (context, child) {
                final double progress =
                    (_radarController.value + (index * 0.33)) % 1.0;
                return Container(
                  width: 250 * progress,
                  height: 250 * progress,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppTheme.primary.withOpacity(
                        max(0.0, 1.0 - progress),
                      ),
                      width: 2,
                    ),
                  ),
                );
              },
            );
          }),
          // Center Icon
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              gradient: AppTheme.primaryGradient,
              shape: BoxShape.circle,
              boxShadow: AppTheme.glowShadow(AppTheme.primary),
            ),
            child: Icon(
              _searchStage == 3 ? Icons.check : Icons.wifi_tethering,
              color: Colors.white,
              size: 32,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusText() {
    String text = 'Scanning nearby devices (BLE/NFC)...';
    if (_searchStage == 1)
      text = 'Peer detected. Establishing secure channel...';
    if (_searchStage == 2)
      text = 'Executing zero-knowledge cryptographic handshake...';
    if (_searchStage == 3) text = 'Transfer completed securely offline.';

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: AppTheme.textPrimary,
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildPeerCard() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: GlassContainer(
        padding: const EdgeInsets.all(20),
        borderColor: _searchStage == 3 ? AppTheme.success : AppTheme.primary,
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: AppTheme.surfaceElevated,
                borderRadius: BorderRadius.circular(25),
              ),
              child: const Center(
                child: Text(
                  'K',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Karim B.',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        Icons.lock,
                        size: 12,
                        color: _searchStage == 3
                            ? AppTheme.success
                            : AppTheme.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _searchStage == 3
                            ? 'Verified'
                            : 'Verifying Identity...',
                        style: TextStyle(
                          color: _searchStage == 3
                              ? AppTheme.success
                              : AppTheme.primary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
