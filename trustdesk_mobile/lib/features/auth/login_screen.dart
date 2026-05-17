import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with TickerProviderStateMixin {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  late AnimationController _pulseController;
  late AnimationController _fadeInController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
    _fadeInController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _pulseController.dispose();
    _fadeInController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    HapticFeedback.mediumImpact();
    setState(() => _isLoading = true);
    // Simulate auth
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      setState(() => _isLoading = false);
      context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background gradient
          Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0.3, -0.5),
                radius: 1.8,
                colors: [
                  Color(0xFF1A2744),
                  AppTheme.backgroundDark,
                  AppTheme.backgroundDark,
                ],
              ),
            ),
          ),

          // Grid pattern overlay
          Positioned.fill(
            child: CustomPaint(painter: _GridPainter()),
          ),

          // Animated glow orb
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Positioned(
                top: size.height * 0.12,
                left: size.width / 2 - 100,
                child: Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.primary.withAlpha(
                          (30 + 20 * _pulseController.value).toInt(),
                        ),
                        blurRadius: 80 + 40 * _pulseController.value,
                        spreadRadius: 20,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),

          // Content
          SafeArea(
            child: FadeTransition(
              opacity: CurvedAnimation(
                parent: _fadeInController,
                curve: Curves.easeOut,
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    SizedBox(height: size.height * 0.1),

                    // Logo & Branding
                    Center(
                      child: Column(
                        children: [
                          Container(
                            width: 72,
                            height: 72,
                            decoration: BoxDecoration(
                              gradient: AppTheme.primaryGradient,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: AppTheme.glowShadow(AppTheme.primary, blur: 30),
                            ),
                            child: const Icon(Icons.shield_rounded, color: Colors.white, size: 36),
                          ),
                          const SizedBox(height: 20),
                          const Text(
                            'TrustDesk',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Secure · Monitor · Respond',
                            style: TextStyle(
                              color: AppTheme.textMuted,
                              fontSize: 14,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: size.height * 0.06),

                    // Login Card
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppTheme.radiusXl),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                        child: Container(
                          padding: const EdgeInsets.all(28),
                          decoration: BoxDecoration(
                            color: AppTheme.surface.withAlpha(180),
                            borderRadius: BorderRadius.circular(AppTheme.radiusXl),
                            border: Border.all(
                              color: Colors.white.withAlpha(12),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              const Text(
                                'Sign In',
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.w700,
                                  color: AppTheme.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Access your security console',
                                style: TextStyle(
                                  color: AppTheme.textMuted,
                                  fontSize: 13,
                                ),
                              ),
                              const SizedBox(height: 28),

                              // Email
                              TextField(
                                controller: _emailController,
                                keyboardType: TextInputType.emailAddress,
                                style: const TextStyle(color: AppTheme.textPrimary, fontSize: 15),
                                decoration: InputDecoration(
                                  prefixIcon: const Icon(Icons.email_outlined, color: AppTheme.textMuted, size: 20),
                                  hintText: 'agent@trustdesk.io',
                                  label: const Text('Email Address'),
                                ),
                              ),
                              const SizedBox(height: 18),

                              // Password
                              TextField(
                                controller: _passwordController,
                                obscureText: _obscurePassword,
                                style: const TextStyle(color: AppTheme.textPrimary, fontSize: 15),
                                decoration: InputDecoration(
                                  prefixIcon: const Icon(Icons.lock_outline, color: AppTheme.textMuted, size: 20),
                                  hintText: '••••••••',
                                  label: const Text('Password'),
                                  suffixIcon: IconButton(
                                    icon: Icon(
                                      _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                      color: AppTheme.textMuted,
                                      size: 20,
                                    ),
                                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),

                              // Forgot password
                              Align(
                                alignment: Alignment.centerRight,
                                child: TextButton(
                                  onPressed: () {},
                                  child: const Text(
                                    'Forgot password?',
                                    style: TextStyle(color: AppTheme.primary, fontSize: 13),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),

                              // Login button
                              SizedBox(
                                height: 54,
                                child: ElevatedButton(
                                  onPressed: _isLoading ? null : _handleLogin,
                                  style: ElevatedButton.styleFrom(
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                                    ),
                                  ),
                                  child: _isLoading
                                      ? const SizedBox(
                                          width: 22,
                                          height: 22,
                                          child: CircularProgressIndicator(
                                            color: Colors.white,
                                            strokeWidth: 2.5,
                                          ),
                                        )
                                      : const Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Icon(Icons.login_rounded, size: 20),
                                            SizedBox(width: 10),
                                            Text('AUTHENTICATE', style: TextStyle(letterSpacing: 1)),
                                          ],
                                        ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 28),

                    // Biometric / Alternative
                    Center(
                      child: Column(
                        children: [
                          Text(
                            'or continue with',
                            style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                          ),
                          const SizedBox(height: 18),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildAuthOption(Icons.fingerprint, 'Biometric'),
                              const SizedBox(width: 16),
                              _buildAuthOption(Icons.qr_code_scanner_rounded, 'QR Code'),
                              const SizedBox(width: 16),
                              _buildAuthOption(Icons.vpn_key_rounded, 'YubiKey'),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Version footer
                    Center(
                      child: Text(
                        'TrustDesk Mobile • v2.4.1',
                        style: TextStyle(
                          color: AppTheme.textDisabled,
                          fontSize: 11,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAuthOption(IconData icon, String label) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        _handleLogin();
      },
      child: Container(
        width: 80,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: AppTheme.surfaceElevated,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          border: Border.all(color: AppTheme.border),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppTheme.primary, size: 24),
            const SizedBox(height: 6),
            Text(label, style: const TextStyle(color: AppTheme.textMuted, fontSize: 10, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withAlpha(6)
      ..strokeWidth = 0.5;

    const spacing = 40.0;
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
