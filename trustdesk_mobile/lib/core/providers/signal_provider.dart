import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'api_provider.dart';
import '../models/community_signal.dart';

class SignalNotifier extends AsyncNotifier<List<CommunitySignal>> {
  @override
  Future<List<CommunitySignal>> build() async {
    return fetchSignals();
  }

  Future<List<CommunitySignal>> fetchSignals() async {
    final dio = ref.read(dioProvider);
    
    // Determine Current Location
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled.');
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied.');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied.');
    }

    final position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(accuracy: LocationAccuracy.medium)
    );

    final response = await dio.get('/community/signals', queryParameters: {
      'latitude': position.latitude,
      'longitude': position.longitude,
      'radius_km': 50,
    });

    List<dynamic> dataList = [];
    if (response.data is Map && response.data.containsKey('data')) {
      dataList = response.data['data'];
    } else if (response.data is List) {
      dataList = response.data;
    }
    
    return dataList.map((json) => CommunitySignal.fromJson(json)).toList();
  }
}

final signalProvider = AsyncNotifierProvider<SignalNotifier, List<CommunitySignal>>(() {
  return SignalNotifier();
});
