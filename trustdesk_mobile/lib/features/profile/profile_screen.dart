
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';
import '../../shared/bottom_nav.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _biometricEnabled = true;
  bool _pushNotifications = true;
  bool _darkMode = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Profile', style: TextStyle(fontWeight: FontWeight.w700)),
        automaticallyImplyLeading: false,
        actions: [
          TextButton(
            onPressed: () {
              HapticFeedback.mediumImpact();
              context.go('/login');
            },
            child: const Text('Sign Out', style: TextStyle(color: AppTheme.danger, fontSize: 14)),
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topLeft,
            radius: 2.0,
            colors: [Color(0xFF141E30), AppTheme.backgroundDark],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
            child: Column(
              children: [
                // Avatar & Identity Card
                GlassContainer(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Avatar
                      Stack(
                        clipBehavior: Clip.none,
                        children: [
                          Container(
                            width: 90,
                            height: 90,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: AppTheme.primaryGradient,
                              boxShadow: AppTheme.glowShadow(AppTheme.primary, blur: 24),
                            ),
                            child: const Center(
                              child: Text(
                                'AK',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 32,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: -2,
                            right: -2,
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: AppTheme.success,
                                shape: BoxShape.circle,
                                border: Border.all(color: AppTheme.surface, width: 3),
                              ),
                              child: const Icon(Icons.check, size: 12, color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Agent Khalil',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'khalil@trustdesk.io',
                        style: TextStyle(
                          color: AppTheme.textMuted,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Security Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppTheme.success.withAlpha(20),
                          borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                          border: Border.all(color: AppTheme.success.withAlpha(60)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.verified_user, color: AppTheme.success, size: 16),
                            SizedBox(width: 8),
                            Text(
                              'LEVEL 5 ─ CLEARANCE',
                              style: TextStyle(
                                color: AppTheme.success,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Quick Stats
                Row(
                  children: [
                    Expanded(child: _buildStatCard('142', 'Incidents\nHandled', AppTheme.primary)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildStatCard('98.2%', 'Response\nRate', AppTheme.success)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildStatCard('3.2s', 'Avg.\nResponse', AppTheme.accentNeon)),
                  ],
                ),

                const SizedBox(height: 20),

                // Security Settings
                _buildSectionHeader('Security'),
                const SizedBox(height: 12),

                GlassContainer(
                  padding: EdgeInsets.zero,
                  child: Column(
                    children: [
                      _buildToggleRow(
                        Icons.fingerprint,
                        'Biometric Login',
                        'Face ID & Fingerprint',
                        _biometricEnabled,
                        (v) => setState(() => _biometricEnabled = v),
                      ),
                      _buildDivider(),
                      _buildToggleRow(
                        Icons.notifications_active_outlined,
                        'Push Notifications',
                        'Real-time threat alerts',
                        _pushNotifications,
                        (v) => setState(() => _pushNotifications = v),
                      ),
                      _buildDivider(),
                      _buildToggleRow(
                        Icons.dark_mode_outlined,
                        'Dark Mode',
                        'Always dark interface',
                        _darkMode,
                        (v) => setState(() => _darkMode = v),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Account Actions
                _buildSectionHeader('Account'),
                const SizedBox(height: 12),

                GlassContainer(
                  padding: EdgeInsets.zero,
                  child: Column(
                    children: [
                      _buildActionRow(Icons.vpn_key_outlined, 'API Keys', 'Manage integrations'),
                      _buildDivider(),
                      _buildActionRow(Icons.devices_outlined, 'Active Sessions', '3 devices'),
                      _buildDivider(),
                      _buildActionRow(Icons.shield_outlined, 'Two-Factor Auth', 'TOTP active'),
                      _buildDivider(),
                      _buildActionRow(Icons.download_outlined, 'Export Data', 'Download audit logs'),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Recent Activity
                _buildSectionHeader('Recent Activity'),
                const SizedBox(height: 12),

                GlassContainer(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _buildActivityItem('Incident #2847 resolved', '2 min ago', AppTheme.success),
                      const SizedBox(height: 12),
                      _buildActivityItem('API key rotated (Production)', '1h ago', AppTheme.primary),
                      const SizedBox(height: 12),
                      _buildActivityItem('Threat level escalated – Zone B', '3h ago', AppTheme.warning),
                      const SizedBox(height: 12),
                      _buildActivityItem('System lockdown lifted', '5h ago', AppTheme.danger),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Version Info
                Center(
                  child: Text(
                    'TrustDesk Mobile • v2.4.1 (build 1892)',
                    style: TextStyle(
                      color: AppTheme.textDisabled,
                      fontSize: 11,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: const CoreBottomNav(currentIndex: 4),
    );
  }

  Widget _buildStatCard(String value, String label, Color color) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 22,
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
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          color: AppTheme.textMuted,
          fontSize: 12,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.5,
        ),
      ),
    );
  }

  Widget _buildToggleRow(IconData icon, String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppTheme.primary.withAlpha(15),
              borderRadius: BorderRadius.circular(AppTheme.radiusSm),
            ),
            child: Icon(icon, color: AppTheme.primary, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 15, fontWeight: FontWeight.w600)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: (v) {
              HapticFeedback.lightImpact();
              onChanged(v);
            },
            activeTrackColor: AppTheme.primary,
            activeThumbColor: Colors.white,
          ),
        ],
      ),
    );
  }

  Widget _buildActionRow(IconData icon, String title, String trailing) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => HapticFeedback.lightImpact(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppTheme.surfaceElevated,
                  borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                ),
                child: Icon(icon, color: AppTheme.textSecondary, size: 20),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(title, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 15, fontWeight: FontWeight.w500)),
              ),
              Text(trailing, style: const TextStyle(color: AppTheme.textMuted, fontSize: 13)),
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right, color: AppTheme.textMuted, size: 18),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 1,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      color: AppTheme.border,
    );
  }

  Widget _buildActivityItem(String text, String time, Color dotColor) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: dotColor,
            shape: BoxShape.circle,
            boxShadow: [BoxShadow(color: dotColor.withAlpha(60), blurRadius: 6)],
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(text, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
        ),
        Text(time, style: const TextStyle(color: AppTheme.textDisabled, fontSize: 11)),
      ],
    );
  }
}
