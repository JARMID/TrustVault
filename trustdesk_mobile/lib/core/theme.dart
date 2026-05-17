import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Colors
  static const Color primary = Color(0xFF3B82F6);
  static const Color primaryLight = Color(0xFF60A5FA);
  static const Color primaryDark = Color(0xFF2563EB);
  static const Color danger = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color success = Color(0xFF10B981);
  static const Color info = Color(0xFF06B6D4);

  // Background Palette
  static const Color background = Color(0xFF0B0E14);
  static const Color backgroundDark = Color(0xFF05070A);
  static const Color surface = Color(0xFF141921);
  static const Color surfaceElevated = Color(0xFF1A2030);
  static const Color surfaceGlass = Color(0xFF171D29);

  // Text Colors
  static const Color textPrimary = Color(0xFFEDEFF2);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textDisabled = Color(0xFF475569);

  // Accent Colors
  static const Color accentNeon = Color(0xFF00FFCC);
  static const Color accentRed = Color(0xFFFF0055);
  static const Color accentPurple = Color(0xFF8B5CF6);
  static const Color accentAmber = Color(0xFFFBBF24);

  // Border & Divider
  static const Color border = Color(0xFF1E293B);
  static const Color borderLight = Color(0xFF334155);
  static const Color divider = Color(0xFF1E293B);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF3B82F6), Color(0xFF8B5CF6)],
  );

  static const LinearGradient dangerGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
  );

  static const LinearGradient neonGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00FFCC), Color(0xFF3B82F6)],
  );

  static const LinearGradient surfaceGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF141921), Color(0xFF0B0E14)],
  );

  // Spacing
  static const double spacingXs = 4;
  static const double spacingSm = 8;
  static const double spacingMd = 16;
  static const double spacingLg = 24;
  static const double spacingXl = 32;
  static const double spacing2xl = 48;

  // Radius
  static const double radiusSm = 8;
  static const double radiusMd = 12;
  static const double radiusLg = 16;
  static const double radiusXl = 24;
  static const double radiusFull = 999;

  // Shadows
  static List<BoxShadow> glowShadow(Color color, {double blur = 20, double spread = 0}) {
    return [
      BoxShadow(
        color: color.withAlpha(60),
        blurRadius: blur,
        spreadRadius: spread,
      ),
    ];
  }

  static ThemeData get darkTheme {
    final baseTextTheme = GoogleFonts.interTextTheme(ThemeData.dark().textTheme);
    
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      canvasColor: background,
      textTheme: baseTextTheme.copyWith(
        displayLarge: baseTextTheme.displayLarge?.copyWith(
          color: textPrimary,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.5,
        ),
        headlineLarge: baseTextTheme.headlineLarge?.copyWith(
          color: textPrimary,
          fontWeight: FontWeight.w700,
        ),
        headlineMedium: baseTextTheme.headlineMedium?.copyWith(
          color: textPrimary,
          fontWeight: FontWeight.w700,
        ),
        titleLarge: baseTextTheme.titleLarge?.copyWith(
          color: textPrimary,
          fontWeight: FontWeight.w600,
        ),
        bodyLarge: baseTextTheme.bodyLarge?.copyWith(color: textSecondary),
        bodyMedium: baseTextTheme.bodyMedium?.copyWith(color: textSecondary),
        bodySmall: baseTextTheme.bodySmall?.copyWith(color: textMuted),
        labelSmall: baseTextTheme.labelSmall?.copyWith(
          color: textMuted,
          letterSpacing: 1.2,
          fontWeight: FontWeight.w500,
        ),
      ),
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: accentPurple,
        error: danger,
        surface: surface,
        onSurface: textPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: textPrimary,
          letterSpacing: 0.5,
        ),
        iconTheme: IconThemeData(color: textSecondary),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          elevation: 0,
          textStyle: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 15,
            letterSpacing: 0.5,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceElevated,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: const TextStyle(color: textMuted, fontSize: 14),
        labelStyle: const TextStyle(color: textSecondary, fontSize: 14),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(radiusXl)),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: surfaceElevated,
        contentTextStyle: const TextStyle(color: textPrimary),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusMd)),
      ),
      dividerTheme: const DividerThemeData(
        color: divider,
        space: 1,
        thickness: 1,
      ),
    );
  }
}
