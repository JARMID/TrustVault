class DbWallet {
  final String id;
  final String userId;
  final String currency;
  final double balance;
  final String status;
  final bool isPrimary;
  final double? dailyLimit;
  final DateTime createdAt;
  final DateTime updatedAt;

  DbWallet({
    required this.id,
    required this.userId,
    required this.currency,
    required this.balance,
    required this.status,
    required this.isPrimary,
    this.dailyLimit,
    required this.createdAt,
    required this.updatedAt,
  });

  factory DbWallet.fromJson(Map<String, dynamic> json) {
    return DbWallet(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      currency: json['currency'] as String,
      balance: (json['balance'] as num).toDouble(),
      status: json['status'] as String,
      isPrimary: json['is_primary'] as bool,
      dailyLimit: json['daily_limit'] != null ? (json['daily_limit'] as num).toDouble() : null,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }
}

class DbTransaction {
  final String id;
  final String walletId;
  final String type;
  final double amount;
  final String currency;
  final String status;
  final String reference;
  final String description;
  final String? counterparty;
  final Map<String, dynamic>? metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  DbTransaction({
    required this.id,
    required this.walletId,
    required this.type,
    required this.amount,
    required this.currency,
    required this.status,
    required this.reference,
    required this.description,
    this.counterparty,
    this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory DbTransaction.fromJson(Map<String, dynamic> json) {
    return DbTransaction(
      id: json['id'] as String,
      walletId: json['wallet_id'] as String,
      type: json['type'] as String,
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      status: json['status'] as String,
      reference: json['reference'] as String,
      description: json['description'] as String,
      counterparty: json['counterparty'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }
}

class DbVirtualCard {
  final String id;
  final String walletId;
  final String cardNumberMasked;
  final int expiryMonth;
  final int expiryYear;
  final String status;
  final double? spendingLimit;
  final DateTime createdAt;
  final DateTime updatedAt;

  DbVirtualCard({
    required this.id,
    required this.walletId,
    required this.cardNumberMasked,
    required this.expiryMonth,
    required this.expiryYear,
    required this.status,
    this.spendingLimit,
    required this.createdAt,
    required this.updatedAt,
  });

  factory DbVirtualCard.fromJson(Map<String, dynamic> json) {
    return DbVirtualCard(
      id: json['id'] as String,
      walletId: json['wallet_id'] as String,
      cardNumberMasked: json['card_number_masked'] as String,
      expiryMonth: json['expiry_month'] as int,
      expiryYear: json['expiry_year'] as int,
      status: json['status'] as String,
      spendingLimit: json['spending_limit'] != null ? (json['spending_limit'] as num).toDouble() : null,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }
}
