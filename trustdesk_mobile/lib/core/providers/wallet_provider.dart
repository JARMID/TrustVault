import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/wallet_models.dart';

class WalletState {
  final List<DbWallet> wallets;
  final List<DbVirtualCard> cards;
  final List<DbTransaction> transactions;
  final bool isLoading;
  final String? error;

  WalletState({
    this.wallets = const [],
    this.cards = const [],
    this.transactions = const [],
    this.isLoading = false,
    this.error,
  });

  double get totalBalance {
    return wallets
        .where((w) => w.status == 'active')
        .fold(0.0, (sum, w) => sum + w.balance);
  }

  DbWallet? get primaryWallet {
    try {
      return wallets.firstWhere((w) => w.isPrimary);
    } catch (_) {
      return null;
    }
  }

  WalletState copyWith({
    List<DbWallet>? wallets,
    List<DbVirtualCard>? cards,
    List<DbTransaction>? transactions,
    bool? isLoading,
    String? error,
  }) {
    return WalletState(
      wallets: wallets ?? this.wallets,
      cards: cards ?? this.cards,
      transactions: transactions ?? this.transactions,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class WalletNotifier extends StateNotifier<WalletState> {
  WalletNotifier() : super(WalletState(isLoading: true)) {
    _init();
  }

  RealtimeChannel? _channel;

  Future<void> _init() async {
    try {
      await _fetchInitialData();
      _setupRealtime();
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> _fetchInitialData() async {
    final client = Supabase.instance.client;

    final walletsRes = await client.from('wallets').select().order('created_at', ascending: false);
    final cardsRes = await client.from('virtual_cards').select().order('created_at', ascending: false);
    final txRes = await client.from('transactions').select().order('created_at', ascending: false);

    state = state.copyWith(
      isLoading: false,
      wallets: (walletsRes as List).map((e) => DbWallet.fromJson(e)).toList(),
      cards: (cardsRes as List).map((e) => DbVirtualCard.fromJson(e)).toList(),
      transactions: (txRes as List).map((e) => DbTransaction.fromJson(e)).toList(),
    );
  }

  void _setupRealtime() {
    final client = Supabase.instance.client;

    _channel = client.channel('wallet-realtime-mobile');

    _channel!
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'wallets',
          callback: (payload) {
            if (payload.eventType == PostgresChangeEvent.update) {
              final newWallet = DbWallet.fromJson(payload.newRecord);
              state = state.copyWith(
                wallets: state.wallets.map((w) => w.id == newWallet.id ? newWallet : w).toList(),
              );
            } else if (payload.eventType == PostgresChangeEvent.insert) {
              final newWallet = DbWallet.fromJson(payload.newRecord);
              state = state.copyWith(wallets: [newWallet, ...state.wallets]);
            }
          },
        )
        .onPostgresChanges(
          event: PostgresChangeEvent.update,
          schema: 'public',
          table: 'virtual_cards',
          callback: (payload) {
            final newCard = DbVirtualCard.fromJson(payload.newRecord);
            state = state.copyWith(
              cards: state.cards.map((c) => c.id == newCard.id ? newCard : c).toList(),
            );
          },
        )
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'transactions',
          callback: (payload) {
            final newTx = DbTransaction.fromJson(payload.newRecord);
            state = state.copyWith(transactions: [newTx, ...state.transactions]);
          },
        )
        .onPostgresChanges(
          event: PostgresChangeEvent.update,
          schema: 'public',
          table: 'transactions',
          callback: (payload) {
            final newTx = DbTransaction.fromJson(payload.newRecord);
            state = state.copyWith(
              transactions: state.transactions.map((t) => t.id == newTx.id ? newTx : t).toList(),
            );
          },
        )
        .subscribe();
  }

  Future<void> freezeCard(String cardId) async {
    // Optimistic update
    state = state.copyWith(
      cards: state.cards.map((c) {
        if (c.id == cardId) {
          return DbVirtualCard(
            id: c.id,
            walletId: c.walletId,
            cardNumberMasked: c.cardNumberMasked,
            expiryMonth: c.expiryMonth,
            expiryYear: c.expiryYear,
            status: 'frozen',
            spendingLimit: c.spendingLimit,
            createdAt: c.createdAt,
            updatedAt: DateTime.now(),
          );
        }
        return c;
      }).toList(),
    );

    try {
      await Supabase.instance.client
          .from('virtual_cards')
          .update({'status': 'frozen'})
          .eq('id', cardId);
    } catch (e) {
      // Revert if failed
      await _fetchInitialData();
    }
  }

  Future<void> unfreezeCard(String cardId) async {
    // Optimistic update
    state = state.copyWith(
      cards: state.cards.map((c) {
        if (c.id == cardId) {
          return DbVirtualCard(
            id: c.id,
            walletId: c.walletId,
            cardNumberMasked: c.cardNumberMasked,
            expiryMonth: c.expiryMonth,
            expiryYear: c.expiryYear,
            status: 'active',
            spendingLimit: c.spendingLimit,
            createdAt: c.createdAt,
            updatedAt: DateTime.now(),
          );
        }
        return c;
      }).toList(),
    );

    try {
      await Supabase.instance.client
          .from('virtual_cards')
          .update({'status': 'active'})
          .eq('id', cardId);
    } catch (e) {
      await _fetchInitialData();
    }
  }

  @override
  void dispose() {
    _channel?.unsubscribe();
    super.dispose();
  }
}

final walletProvider = StateNotifierProvider<WalletNotifier, WalletState>((ref) {
  return WalletNotifier();
});
