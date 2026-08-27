import 'package:flutter/material.dart';
import 'package:food_app/screens/auth/login_screen.dart';

import '../screens/auth/auth_options_screen.dart';
import 'app_routes.dart';

class RouteManager {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.auth:
        return MaterialPageRoute(builder: (_) => const AuthOptionsScreen());

      case AppRoutes.login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());

      case AppRoutes.signup:
        return MaterialPageRoute(
          builder: (_) =>
              const Scaffold(body: Center(child: Text('Signup Screen'))),
        );

      case AppRoutes.home:
        return MaterialPageRoute(
          builder: (_) =>
              const Scaffold(body: Center(child: Text('Home Screen'))),
        );

      default:
        return MaterialPageRoute(
          builder: (_) =>
              const Scaffold(body: Center(child: Text('Page Not Found'))),
        );
    }
  }
}
