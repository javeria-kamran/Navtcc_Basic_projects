import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class FoodImage extends StatelessWidget {
  const FoodImage({
    super.key,
    required this.assetPath,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
  });

  final String assetPath;
  final double? width;
  final double? height;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      assetPath,
      width: width,
      height: height,
      fit: fit,
      placeholderBuilder: (context) => Container(
        width: width,
        height: height,
        color: const Color(0xFFF3F4F6),
        child: const Center(child: Icon(Icons.fastfood)),
      ),
    );
  }
}
