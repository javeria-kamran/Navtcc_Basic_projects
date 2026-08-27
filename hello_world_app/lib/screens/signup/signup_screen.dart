import 'package:flutter/material.dart';
import 'package:hello_world_app/constants/app_colors.dart';
import 'package:hello_world_app/screens/login/login_screen.dart';
import 'package:hello_world_app/widgets/custom_button.dart';
import 'package:hello_world_app/widgets/custom_text_field.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  String? _nameError;
  String? _emailError;
  String? _passwordError;
  String? _confirmPasswordError;

  void _submit() {
    setState(() {
      _nameError = _nameController.text.trim().isEmpty ? 'Please enter your name' : null;
      _emailError = _emailController.text.trim().isEmpty
          ? 'Please enter your email'
          : (!_emailController.text.contains('@') ? 'Please enter a valid email' : null);
      _passwordError = _passwordController.text.isEmpty ? 'Please enter a password' : null;
      _confirmPasswordError = _confirmPasswordController.text != _passwordController.text
          ? 'Passwords do not match'
          : null;
    });

    if (_nameError == null && _emailError == null && _passwordError == null && _confirmPasswordError == null) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffold,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppColors.text,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Create account',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.text),
              ),
              const SizedBox(height: 8),
              const Text(
                'Join us and start ordering favorite meals',
                style: TextStyle(fontSize: 15, color: AppColors.muted),
              ),
              const SizedBox(height: 28),
              CustomTextField(
                label: 'Name',
                hint: 'Your full name',
                controller: _nameController,
              ),
              if (_nameError != null) ...[
                const SizedBox(height: 6),
                Text(_nameError!, style: const TextStyle(color: AppColors.primary, fontSize: 12)),
              ],
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Email',
                hint: 'you@example.com',
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
              ),
              if (_emailError != null) ...[
                const SizedBox(height: 6),
                Text(_emailError!, style: const TextStyle(color: AppColors.primary, fontSize: 12)),
              ],
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Password',
                hint: 'Create a password',
                obscureText: true,
                controller: _passwordController,
              ),
              if (_passwordError != null) ...[
                const SizedBox(height: 6),
                Text(_passwordError!, style: const TextStyle(color: AppColors.primary, fontSize: 12)),
              ],
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Confirm Password',
                hint: 'Confirm your password',
                obscureText: true,
                controller: _confirmPasswordController,
              ),
              if (_confirmPasswordError != null) ...[
                const SizedBox(height: 6),
                Text(_confirmPasswordError!, style: const TextStyle(color: AppColors.primary, fontSize: 12)),
              ],
              const SizedBox(height: 24),
              CustomButton(label: 'Sign Up', onPressed: _submit),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Already have an account? '),
                  TextButton(
                    onPressed: () => Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                    ),
                    child: const Text('Login', style: TextStyle(color: AppColors.primary)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
