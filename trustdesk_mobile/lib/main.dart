import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme.dart';
import 'core/router.dart';

void main() {
  runApp(
    const ProviderScope(
      child: TrustDeskApp(),
    ),
  );
}

class TrustDeskApp extends ConsumerWidget {
  const TrustDeskApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'TrustDesk',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: appRouter,
    );
  }
}
