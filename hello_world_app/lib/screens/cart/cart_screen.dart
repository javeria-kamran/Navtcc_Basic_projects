import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:hello_world_app/constants/app_colors.dart';
import 'package:hello_world_app/models/cart_item.dart';
import 'package:hello_world_app/widgets/custom_button.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key, required this.cartItems});

  final List<CartItem> cartItems;

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  late List<CartItem> _cartItems;

  @override
  void initState() {
    super.initState();
    _cartItems = List.from(widget.cartItems);
  }

  void _updateQuantity(int index, int delta) {
    setState(() {
      final item = _cartItems[index];
      final newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        _cartItems.removeAt(index);
      } else {
        _cartItems[index] = CartItem(food: item.food, quantity: newQuantity);
      }
    });
  }

  double get _subtotal {
    return _cartItems.fold(0.0, (sum, item) => sum + item.food.price * item.quantity);
  }

  double get _deliveryFee => _cartItems.isEmpty ? 0.0 : 3.99;
  double get _total => _subtotal + _deliveryFee;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffold,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppColors.text,
        title: const Text('Cart'),
      ),
      body: SafeArea(
        child: _cartItems.isEmpty
            ? const Center(
                child: Text('Your cart is empty', style: TextStyle(fontSize: 18, color: AppColors.muted)),
              )
            : Column(
                children: [
                  Expanded(
                    child: ListView.separated(
                      padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                      itemCount: _cartItems.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final item = _cartItems[index];
                        return Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 10)),
                            ],
                          ),
                          child: Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(16),
                                child: Container(
                                  width: 72,
                                  height: 72,
                                  decoration: const BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [Color(0xFFFFF1E8), Color(0xFFFFE8D6)],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                  ),
                                  child: Center(
                                    child: SvgPicture.asset(
                                      item.food.image,
                                      width: 55,
                                      height: 55,
                                      fit: BoxFit.contain,
                                      placeholderBuilder: (context) => const Center(child: Icon(Icons.fastfood)),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(item.food.name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                                    const SizedBox(height: 4),
                                    Text('\$${item.food.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 14, color: AppColors.primary)),
                                  ],
                                ),
                              ),
                              Column(
                                children: [
                                  Row(
                                    children: [
                                      IconButton(
                                        onPressed: () => _updateQuantity(index, -1),
                                        icon: const Icon(Icons.remove_circle_outline),
                                      ),
                                      Text('${item.quantity}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                                      IconButton(
                                        onPressed: () => _updateQuantity(index, 1),
                                        icon: const Icon(Icons.add_circle_outline),
                                      ),
                                    ],
                                  ),
                                  TextButton(
                                    onPressed: () => _updateQuantity(index, -100),
                                    child: const Text('Remove', style: TextStyle(color: AppColors.primary)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.all(20),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 10)),
                      ],
                    ),
                    child: Column(
                      children: [
                        _buildSummaryRow('Subtotal', _subtotal),
                        const SizedBox(height: 8),
                        _buildSummaryRow('Delivery', _deliveryFee),
                        const SizedBox(height: 8),
                        _buildSummaryRow('Total', _total, isBold: true),
                        const SizedBox(height: 16),
                        CustomButton(label: 'Checkout', onPressed: () {}),
                      ],
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, double value, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 14, fontWeight: isBold ? FontWeight.w700 : FontWeight.w500)),
        Text('\$${value.toStringAsFixed(2)}', style: TextStyle(fontSize: 14, fontWeight: isBold ? FontWeight.w700 : FontWeight.w500)),
      ],
    );
  }
}
