import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../core/models/wallet_models.dart';
import '../../core/providers/wallet_provider.dart';
import '../../shared/glass_container.dart';

class SendMoneyScreen extends ConsumerStatefulWidget {
  const SendMoneyScreen({super.key});

  @override
  ConsumerState<SendMoneyScreen> createState() => _SendMoneyScreenState();
}

class _SendMoneyScreenState extends ConsumerState<SendMoneyScreen>
    with SingleTickerProviderStateMixin {
  final _emailCtrl = TextEditingController();
  final _amountCtrl = TextEditingController();
  final _noteCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  bool _isSending = false;
  String? _error;
  int _step = 0; // 0 = form, 1 = confirm, 2 = result

  late AnimationController _successCtrl;
  late Animation<double> _successScale;

  @override
  void initState() {
    super.initState();
    _successCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _successScale = CurvedAnimation(
      parent: _successCtrl,
      curve: Curves.elasticOut,
    );
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _amountCtrl.dispose();
    _noteCtrl.dispose();
    _successCtrl.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _step = 1;
    });

    // Brief confirm delay
    await Future.delayed(const Duration(milliseconds: 500));

    setState(() {
      _isSending = true;
      _error = null;
    });

    final wallet = ref.read(walletProvider);
    final primaryWallet = wallet.primaryWallet;
    if (primaryWallet == null) {
      setState(() {
        _isSending = false;
        _error = 'No active wallet found.';
      });
      return;
    }

    HapticFeedback.mediumImpact();

    final err = await ref
        .read(walletProvider.notifier)
        .sendMoney(
          fromWalletId: primaryWallet.id,
          toEmail: _emailCtrl.text.trim(),
          amount: double.parse(_amountCtrl.text.trim()),
          note: _noteCtrl.text.trim().isEmpty ? null : _noteCtrl.text.trim(),
        );

    if (err == null) {
      setState(() {
        _isSending = false;
        _step = 2;
      });
      _successCtrl.forward();
      HapticFeedback.heavyImpact();
    } else {
      setState(() {
        _isSending = false;
        _error = err;
        _step = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final wallet = ref.watch(walletProvider);
    final primary = wallet.primaryWallet;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new_rounded,
            color: AppTheme.textPrimary,
            size: 20,
          ),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Send Money',
          style: TextStyle(
            fontWeight: FontWeight.w700,
            letterSpacing: 0.3,
            color: AppTheme.textPrimary,
          ),
        ),
        centerTitle: true,
      ),
      body: Container(
        color: AppTheme.background,
        child: SafeArea(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 400),
            transitionBuilder: (child, animation) => FadeTransition(
              opacity: animation,
              child: SlideTransition(
                position:
                    Tween<Offset>(
                      begin: const Offset(0, 0.05),
                      end: Offset.zero,
                    ).animate(
                      CurvedAnimation(parent: animation, curve: Curves.easeOut),
                    ),
                child: child,
              ),
            ),
            child: _step == 2 ? _buildSuccess() : _buildForm(primary),
          ),
        ),
      ),
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  Widget _buildForm(DbWallet? primaryWallet) {
    return SingleChildScrollView(
      key: const ValueKey('form'),
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance badge
            if (primaryWallet != null)
              Center(
                child: GlassContainer(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 16,
                  ),
                  child: Column(
                    children: [
                      Text(
                        'Available Balance',
                        style: TextStyle(
                          color: AppTheme.textDisabled,
                          fontSize: 12,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '${primaryWallet.balance.toStringAsFixed(0)} DZD',
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          fontFamily: 'monospace',
                          letterSpacing: -1,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        primaryWallet.currency,
                        style: TextStyle(
                          color: AppTheme.primary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            const SizedBox(height: 32),

            // Recipient
            _sectionLabel('Recipient'),
            const SizedBox(height: 8),
            _buildTextField(
              controller: _emailCtrl,
              hint: 'Email address',
              icon: Icons.person_outline_rounded,
              keyboardType: TextInputType.emailAddress,
              validator: (v) {
                if (v == null || v.trim().isEmpty)
                  return 'Enter recipient email';
                if (!v.contains('@')) return 'Invalid email';
                return null;
              },
            ),

            const SizedBox(height: 20),

            // Amount
            _sectionLabel('Amount'),
            const SizedBox(height: 8),
            _buildTextField(
              controller: _amountCtrl,
              hint: '0 DZD',
              icon: Icons.payments_outlined,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              suffix: 'DZD',
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'Enter amount';
                final n = double.tryParse(v.trim());
                if (n == null || n <= 0) return 'Invalid amount';
                if (primaryWallet != null && n > primaryWallet.balance)
                  return 'Insufficient balance';
                return null;
              },
            ),

            const SizedBox(height: 20),

            // Note
            _sectionLabel('Note (optional)'),
            const SizedBox(height: 8),
            _buildTextField(
              controller: _noteCtrl,
              hint: 'What\'s it for?',
              icon: Icons.notes_rounded,
            ),

            // Error
            if (_error != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.danger.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.danger.withOpacity(0.2)),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.error_outline_rounded,
                      color: AppTheme.danger,
                      size: 16,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _error!,
                        style: TextStyle(
                          color: AppTheme.danger,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 32),

            // Send button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: _isSending
                  ? Center(
                      child: SizedBox(
                        width: 28,
                        height: 28,
                        child: CircularProgressIndicator(
                          color: AppTheme.primary,
                          strokeWidth: 2.5,
                        ),
                      ),
                    )
                  : DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: AppTheme.primaryGradient,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: AppTheme.glowShadow(
                          AppTheme.primary,
                          blur: 20,
                        ),
                      ),
                      child: TextButton(
                        onPressed: _send,
                        style: TextButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.send_rounded,
                              color: Colors.white,
                              size: 18,
                            ),
                            SizedBox(width: 10),
                            Text(
                              'Send Money',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  Widget _buildSuccess() {
    return Center(
      key: const ValueKey('success'),
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ScaleTransition(
              scale: _successScale,
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                  shape: BoxShape.circle,
                  boxShadow: AppTheme.glowShadow(AppTheme.primary, blur: 50),
                ),
                child: const Icon(
                  Icons.check_rounded,
                  color: Colors.white,
                  size: 52,
                ),
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Transfer Complete',
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 26,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              '${_amountCtrl.text} DZD sent to ${_emailCtrl.text}',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.textDisabled, fontSize: 15),
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: OutlinedButton(
                onPressed: () => context.pop(),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: AppTheme.primary.withOpacity(0.4)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: Text(
                  'Back to Dashboard',
                  style: TextStyle(
                    color: AppTheme.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  Widget _sectionLabel(String text) => Text(
    text,
    style: TextStyle(
      color: AppTheme.textDisabled,
      fontSize: 11,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.8,
    ),
  );

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    String? suffix,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: validator,
      style: const TextStyle(
        color: AppTheme.textPrimary,
        fontSize: 15,
        fontWeight: FontWeight.w500,
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: AppTheme.textDisabled, fontSize: 15),
        prefixIcon: Icon(icon, color: AppTheme.primary, size: 20),
        suffixText: suffix,
        suffixStyle: TextStyle(color: AppTheme.textDisabled, fontSize: 14),
        filled: true,
        fillColor: AppTheme.surfaceElevated,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppTheme.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppTheme.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppTheme.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppTheme.danger),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppTheme.danger, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
      ),
    );
  }
}
