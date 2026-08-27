import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:hello_world_app/constants/app_colors.dart';
import 'package:hello_world_app/constants/dummy_data.dart';
import 'package:hello_world_app/models/cart_item.dart';
import 'package:hello_world_app/models/food.dart';
import 'package:hello_world_app/screens/cart/cart_screen.dart';
import 'package:hello_world_app/screens/detail/detail_screen.dart';
import 'package:hello_world_app/screens/profile/profile_screen.dart';
import 'package:hello_world_app/widgets/food_card.dart';
import 'package:hello_world_app/widgets/section_heading.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<String> _categories = ['All', 'Burgers', 'Pizza', 'Pasta', 'Sushi', 'Bowls'];
  String _selectedCategory = 'All';
  final Set<int> _favorites = {1, 3};
  final List<CartItem> _cartItems = [];
  final TextEditingController _searchController = TextEditingController();

  List<Food> get _filteredFoods {
    if (_selectedCategory == 'All') return dummyFoods;
    return dummyFoods.where((food) => food.category == _selectedCategory).toList();
  }

  void _toggleFavorite(int id) {
    setState(() {
      if (_favorites.contains(id)) {
        _favorites.remove(id);
      } else {
        _favorites.add(id);
      }
    });
  }

  void _addToCart(Food food) {
    setState(() {
      final existing = _cartItems.where((item) => item.food.id == food.id).toList();
      if (existing.isNotEmpty) {
        _cartItems[_cartItems.indexOf(existing.first)] = CartItem(food: food, quantity: existing.first.quantity + 1);
      } else {
        _cartItems.add(CartItem(food: food, quantity: 1));
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffold,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Hello, Olivia', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.text)),
                        const SizedBox(height: 4),
                        Text('What would you like to eat?', style: TextStyle(fontSize: 14, color: AppColors.muted)),
                      ],
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 14, offset: const Offset(0, 8)),
                      ],
                    ),
                    child: IconButton(
                      onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CartScreen(cartItems: _cartItems))),
                      icon: const Icon(Icons.shopping_bag_outlined, color: AppColors.text),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 18, offset: const Offset(0, 12)),
                  ],
                ),
                child: TextField(
                  controller: _searchController,
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Search for dishes, cuisines...',
                    hintStyle: TextStyle(color: AppColors.muted, fontSize: 14),
                    prefixIcon: const Icon(Icons.search, color: AppColors.primary),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SectionHeading(title: 'Categories'),
              const SizedBox(height: 12),
              SizedBox(
                height: 42,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _categories.length,
                  itemBuilder: (context, index) {
                    final category = _categories[index];
                    final selected = category == _selectedCategory;
                    return Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: ChoiceChip(
                        label: Text(category),
                        selected: selected,
                        onSelected: (_) => setState(() => _selectedCategory = category),
                        selectedColor: AppColors.primary.withValues(alpha: 0.14),
                        labelStyle: TextStyle(color: selected ? AppColors.primary : AppColors.text),
                        side: BorderSide(color: selected ? AppColors.primary : AppColors.border),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [AppColors.primary, AppColors.secondary], begin: Alignment.topLeft, end: Alignment.bottomRight),
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(color: AppColors.primary.withValues(alpha: 0.25), blurRadius: 24, offset: const Offset(0, 16)),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('Chef’s special', style: TextStyle(fontSize: 13, color: Colors.white70, letterSpacing: 0.4)),
                          SizedBox(height: 6),
                          Text('Up to 40% off!', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                          SizedBox(height: 6),
                          Text('Limited time on premium meals', style: TextStyle(fontSize: 13, color: Colors.white70)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(16)),
                      child: const Icon(Icons.local_offer_outlined, color: Colors.white, size: 24),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              SectionHeading(title: 'Popular now'),
              const SizedBox(height: 12),
              SizedBox(
                height: 250,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _filteredFoods.length,
                  itemBuilder: (context, index) {
                    final food = _filteredFoods[index];
                    return FoodCard(
                      food: food,
                      isFavorite: _favorites.contains(food.id),
                      onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => DetailScreen(food: food, onAdd: () => _addToCart(food)))),
                      onFavoriteToggle: () => _toggleFavorite(food.id),
                      onAdd: () => _addToCart(food),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
              SectionHeading(title: 'Recommended for you'),
              const SizedBox(height: 12),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _filteredFoods.length,
                separatorBuilder: (_, _) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final food = _filteredFoods[index];
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
                            width: 88,
                            height: 88,
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(
                                colors: [Color(0xFFFFF1E8), Color(0xFFFFE8D6)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                            ),
                            child: Center(
                              child: SvgPicture.asset(
                                food.image,
                                width: 70,
                                height: 70,
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
                              Text(food.name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                              const SizedBox(height: 4),
                              Text(food.description, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: AppColors.muted)),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(Icons.star_rounded, color: Colors.amber, size: 16),
                                  const SizedBox(width: 4),
                                  Text('${food.rating}', style: const TextStyle(fontSize: 12, color: AppColors.muted)),
                                  const SizedBox(width: 12),
                                  const Icon(Icons.access_time, color: AppColors.primary, size: 14),
                                  const SizedBox(width: 4),
                                  Text(food.deliveryTime, style: const TextStyle(fontSize: 12, color: AppColors.muted)),
                                ],
                              ),
                            ],
                          ),
                        ),
                        IconButton(onPressed: () => _addToCart(food), icon: const Icon(Icons.add_circle_rounded, color: AppColors.primary)),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: Colors.white,
        destinations: [
          const NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(
            icon: const Icon(Icons.shopping_bag_outlined),
            selectedIcon: const Icon(Icons.shopping_bag),
            label: 'Cart',
          ),
          NavigationDestination(
            icon: const Icon(Icons.person_outline),
            selectedIcon: const Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        onDestinationSelected: (value) {
          if (value == 1) {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => CartScreen(cartItems: _cartItems)));
          } else if (value == 2) {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ProfileScreen()));
          }
        },
      ),
    );
  }
}
