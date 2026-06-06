import 'dart:ui';
import 'package:flutter/material.dart';
import '../core/theme.dart';

class GlassContainer extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final double borderRadius;
  final Color? borderColor;
  final Color? backgroundColor;
  final List<BoxShadow>? boxShadow;
  final VoidCallback? onTap;

  const GlassContainer({
    Key? key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.borderRadius = AppTheme.radiusLg,
    this.borderColor,
    this.backgroundColor,
    this.boxShadow,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final container = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: backgroundColor ?? Colors.white,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderColor ?? AppTheme.border, width: 1),
        boxShadow:
            boxShadow ??
            [
              BoxShadow(
                color: Colors.black.withAlpha(8),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
      ),
      child: child,
    );

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: container);
    }
    return container;
  }
}

/// A variant glass card with a colored accent glow
class GlowGlassCard extends StatelessWidget {
  final Widget child;
  final Color glowColor;
  final EdgeInsets padding;
  final VoidCallback? onTap;

  const GlowGlassCard({
    Key? key,
    required this.child,
    this.glowColor = AppTheme.primary,
    this.padding = const EdgeInsets.all(20),
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: padding,
      backgroundColor: glowColor.withAlpha(10),
      boxShadow: [
        BoxShadow(
          color: glowColor.withAlpha(20),
          blurRadius: 20,
          spreadRadius: -5,
          offset: const Offset(0, 8),
        ),
      ],
      borderColor: glowColor.withAlpha(40),
      onTap: onTap,
      child: child,
    );
  }
}
