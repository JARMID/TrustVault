import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/splash/splash_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/dashboard/dashboard_screen.dart';
import '../features/panic/panic_screen.dart';
import '../features/incidents/incidents_screen.dart';
import '../features/community/community_screen.dart';
import '../features/profile/profile_screen.dart';

/// Premium page transition — smooth fade + slide from bottom
CustomTransitionPage<void> _buildTransition({
  required GoRouterState state,
  required Widget child,
  Duration duration = const Duration(milliseconds: 350),
}) {
  return CustomTransitionPage(
    key: state.pageKey,
    child: child,
    transitionDuration: duration,
    reverseTransitionDuration: const Duration(milliseconds: 250),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final fadeIn = CurvedAnimation(parent: animation, curve: Curves.easeOut);
      final slideUp = Tween<Offset>(
        begin: const Offset(0, 0.04),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutCubic));

      return FadeTransition(
        opacity: fadeIn,
        child: SlideTransition(
          position: slideUp,
          child: child,
        ),
      );
    },
  );
}

final GoRouter appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      pageBuilder: (context, state) => _buildTransition(
        state: state,
        child: const SplashScreen(),
        duration: const Duration(milliseconds: 500),
      ),
    ),
    GoRoute(
      path: '/login',
      pageBuilder: (context, state) => _buildTransition(
        state: state,
        child: const LoginScreen(),
      ),
    ),
    GoRoute(
      path: '/',
      pageBuilder: (context, state) => _buildTransition(
        state: state,
        child: const DashboardScreen(),
      ),
    ),
    GoRoute(
      path: '/panic',
      pageBuilder: (context, state) => _buildTransition(
        state: state,
        child: const PanicScreen(),
      ),
    ),
    GoRoute(
      path: '/incidents',
      pageBuilder: (context, state) => _buildTransition(
        state: state,
        child: const IncidentsScreen(),
      ),
    ),
    GoRoute(
      path: '/community',
      pageBuilder: (context, state) => _buildTransition(
        state: state,
        child: const CommunityScreen(),
      ),
    ),
    GoRoute(
      path: '/profile',
      pageBuilder: (context, state) => _buildTransition(
        state: state,
        child: const ProfileScreen(),
      ),
    ),
  ],
);
