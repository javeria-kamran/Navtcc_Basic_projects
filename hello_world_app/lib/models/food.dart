class Food {
  const Food({
    required this.id,
    required this.name,
    required this.price,
    required this.rating,
    required this.description,
    required this.image,
    required this.category,
    required this.deliveryTime,
  });

  final int id;
  final String name;
  final double price;
  final double rating;
  final String description;
  final String image;
  final String category;
  final String deliveryTime;
}
