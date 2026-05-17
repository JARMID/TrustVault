import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoController;
  late AnimationController _ringController;
  late AnimationController _textController;
  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;
  late Animation<double> _textOpacity;
  late Animation<Offset> _textSlide;

  @override
  void initState() {
    super.initState();

    _logoController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _ringController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();

    _textController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _logoScale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _logoController, curve: Curves.elasticOut),
    );

    _logoOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _logoController, curve: const Interval(0.0, 0.5, curve: Curves.easeOut)),
    );

    _textOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _textController, curve: Curves.easeOut),
    );

    _textSlide = Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero).animate(
      CurvedAnimation(parent: _textController, curve: Curves.easeOutCubic),
    );

    _startSequence();
  }

  Future<void> _startSequence() async {
    await Future.delayed(const Duration(milliseconds: 300));
    _logoController.forward();
    await Future.delayed(const Duration(milliseconds: 600));
    _textController.forward();
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      HapticFeedback.mediumImpact();
      context.go('/login');
    }
  }

  @override
  void dispose() {
    _logoController.dispose();
    _ringController.dispose();
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0.0, -0.3),
            radius: 1.5,
            colors: [
              Color(0xFF1A2744),
              AppTheme.backgroundDark,
              Color(0xFF080C14),
            ],
          ),
        ),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Subtle grid
            Positioned.fill(
              child: CustomPaint(painter: _SplashGridPainter()),
            ),

            // Center content
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Animated ring + logo
                  AnimatedBuilder(
                    animation: Listenable.merge([_logoController, _ringController]),
                    builder: (context, child) {
                      return FadeTransition(
                        opacity: _logoOpacity,
                        child: ScaleTransition(
                          scale: _logoScale,
                          child: SizedBox(
                            width: 130,
                            height: 130,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                // Outer pulse ring
                                Container(
                                  width: 130,
                                  height: 130,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: AppTheme.primary.withAlpha(
                                        (20 + 15 * _ringController.value).toInt(),
                                      ),
                                      width: 1,
                                    ),
                                  ),
                                ),
                                // Inner ring
                                Container(
                                  width: 110,
                                  height: 110,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: AppTheme.primary.withAlpha(10),
                                      width: 1,
                                    ),
                                  ),
                                ),
                                // Logo container
                                Container(
                                  width: 86,
                                  height: 86,
                                  decoration: BoxDecoration(
                                    gradient: AppTheme.primaryGradient,
                                    borderRadius: BorderRadius.circular(22),
                                    boxShadow: AppTheme.glowShadow(AppTheme.primary, blur: 40),
                                  ),
                                  child: const Icon(
                                    Icons.shield_rounded,
                                    color: Colors.white,
                                    size: 42,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 36),

                  // Text
                  SlideTransition(
                    position: _textSlide,
                    child: FadeTransition(
                      opacity: _textOpacity,
                      child: Column(
                        children: [
                          const Text(
                            'TRUSTDESK',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 6,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'SECURITY OPERATIONS CENTER',
                            style: TextStyle(
                              color: AppTheme.primary.withAlpha(180),
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Bottom loading indicator
            Positioned(
              bottom: 80,
              left: 0,
              right: 0,
              child: FadeTransition(
                opacity: _textOpacity,
                child: Column(
                  children: [
                    SizedBox(
                      width: 160,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(2),
                        child: LinearProgressIndicator(
                          minHeight: 2,
                          backgroundColor: AppTheme.border,
                          valueColor: AlwaysStoppedAnimation(AppTheme.primary.withAlpha(120)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Initializing secure session...',
                      style: TextStyle(
                        color: AppTheme.textDisabled,
                        fontSize: 11,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SplashGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withAlpha(4)
      ..strokeWidth = 0.5;

    const spacing = 50.0;
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
