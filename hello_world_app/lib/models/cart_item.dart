import 'package:hello_world_app/models/food.dart';

class CartItem {
  const CartItem({
    required this.food,
    required this.quantity,
  });

  final Food food;
  final int quantity;
}
