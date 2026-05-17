import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/env.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: EnvInfo.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        // Here you would add bearer token dynamically later
        // options.headers['Authorization'] = 'Bearer $token';
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        print('API Error: ${e.response?.statusCode} - ${e.message}');
        return handler.next(e);
      },
    ),
  );

  return dio;
});
