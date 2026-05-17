import 'dart:io';

class EnvInfo {
  static const bool isLocal = true;
  
  // Provide correct local IP based on simulator/emulator
  static String get baseUrl {
    if (isLocal) {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:8000/api';
      } else {
        return 'http://127.0.0.1:8000/api';
      }
    }
    return 'https://trusdesk.production.url/api';
  }
}
