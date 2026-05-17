import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/incident.dart';
import 'api_provider.dart';

class IncidentNotifier extends AsyncNotifier<List<Incident>> {
  @override
  Future<List<Incident>> build() async {
    return fetchIncidents();
  }

  Future<List<Incident>> fetchIncidents() async {
    final dio = ref.read(dioProvider);
    final response = await dio.get('/triage/queue');
    final List<dynamic> data = response.data['data'] ?? [];
    return data.map((e) => Incident.fromJson(e)).toList();
  }
}

final incidentProvider = AsyncNotifierProvider<IncidentNotifier, List<Incident>>(() {
  return IncidentNotifier();
});
