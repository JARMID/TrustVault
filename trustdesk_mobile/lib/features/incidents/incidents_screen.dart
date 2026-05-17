
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../shared/glass_container.dart';
import '../../shared/bottom_nav.dart';
import '../../core/providers/incident_provider.dart';

class IncidentsScreen extends ConsumerStatefulWidget {
  const IncidentsScreen({super.key});

  @override
  ConsumerState<IncidentsScreen> createState() => _IncidentsScreenState();
}

class _IncidentsScreenState extends ConsumerState<IncidentsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _selectedFilter = 0;
  final _filters = ['All', 'Critical', 'Active', 'Resolved'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _filters.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final incidentState = ref.watch(incidentProvider);

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text(
          'Triage Feed',
          style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 1),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.tune_rounded, color: AppTheme.textSecondary),
            onPressed: () => HapticFeedback.lightImpact(),
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.textSecondary),
            onPressed: () {
              HapticFeedback.lightImpact();
              ref.read(incidentProvider.notifier).fetchIncidents();
            },
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topCenter,
            radius: 2.0,
            colors: [Color(0xFF1A1A2E), AppTheme.backgroundDark],
          ),
        ),
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Quick Stats Bar
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
                child: Row(
                  children: [
                    _buildMiniStat('Open', '7', AppTheme.danger),
                    const SizedBox(width: 10),
                    _buildMiniStat('In Review', '12', AppTheme.warning),
                    const SizedBox(width: 10),
                    _buildMiniStat('Closed', '142', AppTheme.success),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Filter Chips
              SizedBox(
                height: 36,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: _filters.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final isActive = index == _selectedFilter;
                    return GestureDetector(
                      onTap: () {
                        HapticFeedback.selectionClick();
                        setState(() => _selectedFilter = index);
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                        decoration: BoxDecoration(
                          gradient: isActive ? AppTheme.primaryGradient : null,
                          color: isActive ? null : AppTheme.surfaceElevated,
                          borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                          border: isActive
                              ? null
                              : Border.all(color: AppTheme.border),
                        ),
                        child: Text(
                          _filters[index],
                          style: TextStyle(
                            color: isActive ? Colors.white : AppTheme.textMuted,
                            fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 16),

              // Submit New Button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: GlowGlassCard(
                  glowColor: AppTheme.primary,
                  onTap: () {
                    HapticFeedback.mediumImpact();
                    _showReportSheet(context);
                  },
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          gradient: AppTheme.primaryGradient,
                          borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                        ),
                        child: const Icon(Icons.add_rounded, color: Colors.white, size: 22),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Submit New Incident',
                              style: TextStyle(
                                color: AppTheme.textPrimary,
                                fontWeight: FontWeight.w700,
                                fontSize: 15,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Create a secure incident ticket',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      Icon(Icons.chevron_right, color: AppTheme.primary.withAlpha(100), size: 22),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Section Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'TRIAGE QUEUE',
                      style: TextStyle(
                        color: AppTheme.textMuted,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.5,
                      ),
                    ),
                    Text(
                      '7 incidents',
                      style: TextStyle(color: AppTheme.textDisabled, fontSize: 12),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // Incidents List
              Expanded(
                child: incidentState.when(
                  data: (incidents) {
                    if (incidents.isEmpty) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.check_circle_outline, color: AppTheme.success.withAlpha(60), size: 64),
                            const SizedBox(height: 16),
                            const Text(
                              'All clear',
                              style: TextStyle(color: AppTheme.textSecondary, fontSize: 18, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'No active incidents in queue',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
                            ),
                          ],
                        ),
                      );
                    }
                    return ListView.separated(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                      itemCount: incidents.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final incident = incidents[index];
                        final isResolved = incident.status.toLowerCase() == 'resolved';
                        final statusColor = isResolved ? AppTheme.success : AppTheme.danger;
                        final priorityColor = _getPriorityColor(incident.priority);

                        return GlassContainer(
                          onTap: () => HapticFeedback.lightImpact(),
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    width: 42,
                                    height: 42,
                                    decoration: BoxDecoration(
                                      color: statusColor.withAlpha(15),
                                      borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                                    ),
                                    child: Icon(
                                      isResolved ? Icons.check_circle_outline : Icons.warning_amber_rounded,
                                      color: statusColor,
                                      size: 22,
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Text(
                                              '#INC-${incident.id}',
                                              style: const TextStyle(
                                                color: AppTheme.accentNeon,
                                                fontWeight: FontWeight.w700,
                                                fontSize: 13,
                                              ),
                                            ),
                                            const Spacer(),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                              decoration: BoxDecoration(
                                                color: statusColor.withAlpha(15),
                                                borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                                                border: Border.all(color: statusColor.withAlpha(40)),
                                              ),
                                              child: Text(
                                                incident.status.toUpperCase(),
                                                style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.w700,
                                                  color: statusColor,
                                                  letterSpacing: 0.5,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          incident.priority?.toUpperCase() ?? 'UNASSIGNED',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 15,
                                            color: priorityColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              // Location bar
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: AppTheme.surfaceElevated,
                                  borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.location_on_outlined, size: 14, color: AppTheme.textMuted),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Lat: ${incident.locationLat.length > 7 ? incident.locationLat.substring(0, 7) : incident.locationLat}, Lng: ${incident.locationLng.length > 7 ? incident.locationLng.substring(0, 7) : incident.locationLng}',
                                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 12, fontFamily: 'monospace'),
                                    ),
                                    const Spacer(),
                                    const Text('2h ago', style: TextStyle(color: AppTheme.textDisabled, fontSize: 11)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    );
                  },
                  loading: () => const Center(
                    child: CircularProgressIndicator(color: AppTheme.primary, strokeWidth: 2),
                  ),
                  error: (err, _) => Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, color: AppTheme.danger, size: 48),
                        const SizedBox(height: 12),
                        Text('Error loading queue', style: TextStyle(color: AppTheme.danger)),
                        const SizedBox(height: 4),
                        Text('$err', style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const CoreBottomNav(currentIndex: 2),
    );
  }

  Color _getPriorityColor(String? priority) {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return AppTheme.danger;
      case 'high':
        return AppTheme.warning;
      case 'medium':
        return AppTheme.primary;
      case 'low':
        return AppTheme.success;
      default:
        return AppTheme.textSecondary;
    }
  }

  Widget _buildMiniStat(String label, String value, Color color) {
    return Expanded(
      child: GlassContainer(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
        child: Row(
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: color.withAlpha(60), blurRadius: 6)],
              ),
            ),
            const SizedBox(width: 8),
            Text(value, style: TextStyle(color: color, fontWeight: FontWeight.w900, fontSize: 18)),
            const Spacer(),
            Text(label, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
          ],
        ),
      ),
    );
  }

  void _showReportSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(AppTheme.radiusXl),
            topRight: Radius.circular(AppTheme.radiusXl),
          ),
          border: Border(
            top: BorderSide(color: AppTheme.primary.withAlpha(40), width: 1),
          ),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 28),
            const Text(
              'Report New Incident',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'All reports are encrypted end-to-end',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
            ),
            const SizedBox(height: 28),
            TextField(
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: InputDecoration(
                labelText: 'Incident Type',
                hintText: 'e.g. Unauthorized Access',
                prefixIcon: const Icon(Icons.category_outlined, size: 20),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                filled: true,
                fillColor: AppTheme.surfaceElevated,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              maxLines: 4,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: InputDecoration(
                labelText: 'Description',
                hintText: 'Provide details about the security event...',
                alignLabelWithHint: true,
                prefixIcon: const Padding(
                  padding: EdgeInsets.only(bottom: 60),
                  child: Icon(Icons.notes_outlined, size: 20),
                ),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                filled: true,
                fillColor: AppTheme.surfaceElevated,
              ),
            ),
            const SizedBox(height: 20),
            OutlinedButton.icon(
              onPressed: () => HapticFeedback.lightImpact(),
              icon: const Icon(Icons.camera_alt_outlined, size: 18),
              label: const Text('ATTACH PHOTO EVIDENCE'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.textSecondary,
                side: const BorderSide(color: AppTheme.border),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
              ),
            ),
            const Spacer(),
            Container(
              height: 52,
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                boxShadow: AppTheme.glowShadow(AppTheme.primary),
              ),
              child: ElevatedButton(
                onPressed: () {
                  HapticFeedback.heavyImpact();
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Row(
                        children: [
                          Icon(Icons.check_circle, color: AppTheme.success, size: 18),
                          SizedBox(width: 10),
                          Text('Incident ticket created successfully'),
                        ],
                      ),
                      backgroundColor: AppTheme.surface,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppTheme.radiusMd)),
                ),
                child: const Text(
                  'SUBMIT SECURE REPORT',
                  style: TextStyle(fontWeight: FontWeight.w700, letterSpacing: 1),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
