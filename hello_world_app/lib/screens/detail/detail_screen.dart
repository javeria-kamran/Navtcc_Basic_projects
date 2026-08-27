import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:hello_world_app/constants/app_colors.dart';
import 'package:hello_world_app/models/food.dart';
import 'package:hello_world_app/widgets/custom_button.dart';

class DetailScreen extends StatefulWidget {
  const DetailScreen({super.key, required this.food, required this.onAdd});

  final Food food;
  final VoidCallback onAdd;

  @override
  State<DetailScreen> createState() => _DetailScreenState();
}

class _DetailScreenState extends State<DetailScreen> {
  int _quantity = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffold,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.favorite_border),
                  ),
                ],
              ),
              Hero(
                tag: 'food-${widget.food.id}',
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(28),
                  child: Container(
                    height: 260,
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xFFFFF1E8), Color(0xFFFFE8D6)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: Center(
                      child: SvgPicture.asset(
                        widget.food.image,
                        width: 220,
                        height: 220,
                        fit: BoxFit.contain,
                        placeholderBuilder: (context) => const Center(child: Icon(Icons.fastfood, size: 64)),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(widget.food.name, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.star_rounded, color: Colors.amber),
                  const SizedBox(width: 6),
                  Text('${widget.food.rating}', style: const TextStyle(fontSize: 14, color: AppColors.muted)),
                  const SizedBox(width: 12),
                  const Icon(Icons.access_time, color: AppColors.primary),
                  const SizedBox(width: 6),
                  Text(widget.food.deliveryTime, style: const TextStyle(fontSize: 14, color: AppColors.muted)),
                ],
              ),
              const SizedBox(height: 20),
              const Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text(widget.food.description, style: const TextStyle(fontSize: 14, height: 1.6, color: AppColors.muted)),
              const SizedBox(height: 20),
              const Text('Ingredients', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: const [
                  Chip(label: Text('Cheese')),
                  Chip(label: Text('Tomato')),
                  Chip(label: Text('Basil')),
                  Chip(label: Text('Garlic')),
                ],
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Price', style: TextStyle(fontSize: 14, color: AppColors.muted)),
                      Text('\$${(widget.food.price * _quantity).toStringAsFixed(2)}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: () => setState(() => _quantity = _quantity > 1 ? _quantity - 1 : 1),
                          icon: const Icon(Icons.remove_circle_outline),
                        ),
                        Text('$_quantity', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                        IconButton(
                          onPressed: () => setState(() => _quantity++),
                          icon: const Icon(Icons.add_circle_outline),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              CustomButton(
                label: 'Add to Cart',
                onPressed: () {
                  widget.onAdd();
                  Navigator.of(context).pop();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
