class CommunitySignal {
  final int id;
  final int userId;
  final String locationLat;
  final String locationLng;
  final String type;
  final String description;
  final int confidenceScore;
  final bool isVerified;
  final String createdAt;

  CommunitySignal({
    required this.id,
    required this.userId,
    required this.locationLat,
    required this.locationLng,
    required this.type,
    required this.description,
    required this.confidenceScore,
    required this.isVerified,
    required this.createdAt,
  });

  factory CommunitySignal.fromJson(Map<String, dynamic> json) {
    return CommunitySignal(
      id: json['id'],
      userId: json['user_id'],
      locationLat: json['latitude'].toString(),
      locationLng: json['longitude'].toString(),
      type: json['type'],
      description: json['description'] ?? '',
      confidenceScore: json['confidence_score'] ?? 0,
      isVerified: json['is_verified'] == 1 || json['is_verified'] == true,
      createdAt: json['created_at'],
    );
  }
}
