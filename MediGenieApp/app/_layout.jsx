// app/_layout.js
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { useColorScheme } from '@/hooks/use-color-scheme';
import store from '../redux/store'

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" /> {/* This redirects to SplashScreen */}
          <Stack.Screen name="SplashScreen" />
          <Stack.Screen name="StartScreen" />
          <Stack.Screen name="(auth)/LoginScreen" />
          <Stack.Screen name="(auth)/SignUpScreen" />
          <Stack.Screen name="(auth)/EmailVerification" />
          <Stack.Screen name="(auth)/ForgotPassword" />
          <Stack.Screen name="(auth)/ResetPassword" />
          <Stack.Screen name="(auth)/TermsConditions" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="screens/ProfileScreen" />
          <Stack.Screen name="screens/MedicalHistory" />
          <Stack.Screen name="screens/HealthStatus" />
          <Stack.Screen name="screens/LifeStyle" />
          <Stack.Screen name="screens/PersonalGoals" />
          <Stack.Screen name="screens/AboutUs" />
          <Stack.Screen name="screens/ResearchAssisstantScreen" />
          <Stack.Screen name="screens/DermIQ" />
          <Stack.Screen name="screens/AiTherapico" />
          <Stack.Screen name="screens/MediLens" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}