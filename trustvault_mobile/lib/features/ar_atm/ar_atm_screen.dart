import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';

class ARAtmScreen extends StatefulWidget {
  const ARAtmScreen({super.key});

  @override
  State<ARAtmScreen> createState() => _ARAtmScreenState();
}

class _ARAtmScreenState extends State<ARAtmScreen> {
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
          'AR Secure Locator',
          style: TextStyle(
            fontWeight: FontWeight.w700,
            letterSpacing: 1,
            color: Colors.white,
          ),
        ),
      ),
      body: Stack(
        children: [
          // Simulated Camera Background
          Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(
                  'https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                ), // Street scene
                fit: BoxFit.cover,
              ),
            ),
          ),

          // Camera overlay filter
          Container(color: Colors.black.withOpacity(0.3)),

          // AR HUD Elements
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  _buildHudHeader(),
                  Expanded(
                    child: Stack(
                      children: [
                        // AR Floating Marker
                        Positioned(
                          top: 150,
                          left: 80,
                          child: _buildArMarker(
                            title: 'TrustVault ATM',
                            distance: '150m',
                            status: 'SECURE',
                          ),
                        ),
                        // AR Floating Marker (Another one)
                        Positioned(
                          top: 250,
                          right: 40,
                          child: _buildArMarker(
                            title: 'Partner ATM',
                            distance: '450m',
                            status: 'MODERATE RISK',
                            isSecure: false,
                          ),
                        ),
                        // Target crosshair
                        Center(
                          child: Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: Colors.white.withOpacity(0.2),
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(50),
                            ),
                            child: Center(
                              child: Container(
                                width: 4,
                                height: 4,
                                decoration: const BoxDecoration(
                                  color: AppTheme.primary,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  _buildBottomControlPanel(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHudHeader() {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      borderRadius: 30,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.gps_fixed, color: AppTheme.primary, size: 16),
          const SizedBox(width: 8),
          const Text(
            'AR ACTIVE • GPS MATCHED',
            style: TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildArMarker({
    required String title,
    required String distance,
    required String status,
    bool isSecure = true,
  }) {
    return Column(
      children: [
        GlassContainer(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          borderColor: isSecure ? AppTheme.success : AppTheme.warning,
          child: Column(
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '$distance • $status',
                style: TextStyle(
                  color: isSecure ? AppTheme.success : AppTheme.warning,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        Container(
          width: 2,
          height: 30,
          color: isSecure
              ? AppTheme.success.withOpacity(0.5)
              : AppTheme.warning.withOpacity(0.5),
        ),
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: isSecure ? AppTheme.success : AppTheme.warning,
            shape: BoxShape.circle,
            boxShadow: AppTheme.glowShadow(
              isSecure ? AppTheme.success : AppTheme.warning,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomControlPanel() {
    return GlassContainer(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildControlIcon(Icons.map_outlined, '2D Map'),
          _buildControlIcon(Icons.filter_alt_outlined, 'Filters'),
          _buildControlIcon(Icons.shield_outlined, 'Safety Data'),
        ],
      ),
    );
  }

  Widget _buildControlIcon(IconData icon, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: Colors.white, size: 28),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: AppTheme.textMuted,
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
