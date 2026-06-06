class Incident {
  final int id;
  final int? userId;
  final String locationLat;
  final String locationLng;
  final String status;
  final String? priority;
  final Map<String, dynamic>? metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  Incident({
    required this.id,
    this.userId,
    required this.locationLat,
    required this.locationLng,
    required this.status,
    this.priority,
    this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Incident.fromJson(Map<String, dynamic> json) {
    return Incident(
      id: json['id'],
      userId: json['user_id'],
      locationLat: json['location_lat'].toString(),
      locationLng: json['location_lng'].toString(),
      status: json['status'],
      priority: json['priority'],
      metadata: json['metadata'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'location_lat': locationLat,
      'location_lng': locationLng,
      'status': status,
      'priority': priority,
      'metadata': metadata,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
