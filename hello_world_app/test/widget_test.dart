import 'package:flutter_test/flutter_test.dart';
import 'package:hello_world_app/main.dart';

void main() {
  testWidgets('app launches to splash screen', (tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('Foodie'), findsOneWidget);
  });
}
