import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'api_provider.dart';

class PanicState {
  final bool isDeploying;
  final bool deployed;
  final String? error;

  PanicState({this.isDeploying = false, this.deployed = false, this.error});
}

class PanicNotifier extends Notifier<PanicState> {
  @override
  PanicState build() {
    return PanicState();
  }

  Future<void> deployPanic() async {
    state = PanicState(isDeploying: true);

    try {
      bool serviceEnabled;
      LocationPermission permission;

      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        state = PanicState(error: 'Location services are disabled.');
        return;
      }

      permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          state = PanicState(error: 'Location permissions are denied');
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        state = PanicState(error: 'Location permissions are permanently denied.');
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.bestForNavigation),
      );

      final dio = ref.read(dioProvider);
      
      // Post to the Laravel backend
      await dio.post('/panic/invoke', data: {
        'location_lat': position.latitude,
        'location_lng': position.longitude,
        'context': 'Immediate emergency panic triggered via mobile.',
      });

      state = PanicState(isDeploying: false, deployed: true);
    } catch (e) {
      state = PanicState(isDeploying: false, error: e.toString());
    }
  }

  void reset() {
    state = PanicState();
  }
}

final panicProvider = NotifierProvider<PanicNotifier, PanicState>(() {
  return PanicNotifier();
});
