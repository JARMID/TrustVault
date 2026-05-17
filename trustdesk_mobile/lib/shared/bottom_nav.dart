import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../core/theme.dart';

class CoreBottomNav extends StatelessWidget {
  final int currentIndex;

  const CoreBottomNav({Key? key, required this.currentIndex}) : super(key: key);

  static const _items = [
    _NavItem(Icons.warning_rounded, 'Panic', '/panic'),
    _NavItem(Icons.dashboard_rounded, 'Dashboard', '/'),
    _NavItem(Icons.list_alt_rounded, 'Triage', '/incidents'),
    _NavItem(Icons.people_outline_rounded, 'Signals', '/community'),
    _NavItem(Icons.person_outline_rounded, 'Profile', '/profile'),
  ];

  void _onItemTapped(BuildContext context, int index) {
    if (index == currentIndex) return;
    HapticFeedback.lightImpact();
    context.go(_items[index].route);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
            decoration: BoxDecoration(
              color: AppTheme.surface.withAlpha(220),
              borderRadius: BorderRadius.circular(AppTheme.radiusXl),
              border: Border.all(
                color: Colors.white.withAlpha(12),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(80),
                  blurRadius: 32,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(_items.length, (i) {
                // Center item (Panic) gets special treatment
                if (i == 0) {
                  return _buildPanicItem(context, i);
                }
                return _buildNavItem(context, i);
              }),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPanicItem(BuildContext context, int index) {
    final isSelected = index == currentIndex;
    
    return GestureDetector(
      onTap: () => _onItemTapped(context, index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.danger.withAlpha(30) : Colors.transparent,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          border: isSelected
              ? Border.all(color: AppTheme.danger.withAlpha(60), width: 1)
              : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.warning_rounded,
              color: isSelected ? AppTheme.danger : AppTheme.textMuted,
              size: 22,
            ),
            const SizedBox(height: 4),
            Text(
              'Panic',
              style: TextStyle(
                color: isSelected ? AppTheme.danger : AppTheme.textMuted,
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(BuildContext context, int index) {
    final isSelected = index == currentIndex;
    final item = _items[index];

    return GestureDetector(
      onTap: () => _onItemTapped(context, index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primary.withAlpha(20) : Colors.transparent,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              item.icon,
              color: isSelected ? AppTheme.accentNeon : AppTheme.textMuted,
              size: 22,
            ),
            const SizedBox(height: 4),
            Text(
              item.label,
              style: TextStyle(
                color: isSelected ? AppTheme.accentNeon : AppTheme.textMuted,
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final String label;
  final String route;

  const _NavItem(this.icon, this.label, this.route);
}
