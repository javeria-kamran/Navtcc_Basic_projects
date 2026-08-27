import 'package:flutter/material.dart';
import 'package:hello_world_app/constants/app_colors.dart';
import 'package:hello_world_app/screens/splash/splash_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Foodie',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
        scaffoldBackgroundColor: AppColors.scaffold,
        appBarTheme: const AppBarTheme(backgroundColor: AppColors.scaffold),
      ),
      home: const SplashScreen(),
    );
  }
}
