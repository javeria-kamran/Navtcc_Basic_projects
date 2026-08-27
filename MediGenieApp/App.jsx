import { View, Text, ImageBackground, StatusBar } from 'react-native'
import React, { useEffect } from 'react';
import '../global.css'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './screens/StartScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import EmailVerification from './screens/EmailVerification';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import HomeScreen from './screens/HomeScreen';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import ProfileScreen from './screens/ProfileScreen';
import MedicalHistory from './screens/MedicalHistory';
import HealthStatus from './screens/HealthStatus';
import LifeStyle from './screens/LifeStyle';
import PersonalGoals from './screens/PersonalGoals';
import MainScreen from './screens/MainScreen';
import TermsConditions from './screens/TermsConditions';
import AboutUs from './screens/AboutUs';
import SymptomCheckerScreen from './screens/SymptomCheckerScreen';
import PDFAnalyzer from './screens/PDFAnalyzer';
import ReportScan from './screens/ReportScan';
import Profile from './screens/Profile';
import SettingsScreen from './screens/SettingsScreen';
import { loadToken } from './redux/slices/authSlice';
import MediLens from './screens/MediLens';


const Init = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);
  return children;
};

const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(loadToken()); // 🔥 restore session if token exists
  // }, [dispatch]);

  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <Init>
        <NavigationContainer>
          <StatusBar
            animated={true}
            barStyle="dark-content"
            showHideTransition="fade"
            hidden={true}
          />
          <Stack.Navigator
            initialRouteName="GettingStarted"
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="GettingStarted" component={StartScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name='EmailVerification' component={EmailVerification} />
            <Stack.Screen name='ResetPassword' component={ResetPassword} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="MedicalHistory" component={MedicalHistory} />
            <Stack.Screen name="HealthStatus" component={HealthStatus} />
            <Stack.Screen name="LifeStyle" component={LifeStyle} />
            <Stack.Screen name="PersonalGoals" component={PersonalGoals} />
            <Stack.Screen name='MainScreen' component={MainScreen} />
            <Stack.Screen name='AboutUs' component={AboutUs} />
            <Stack.Screen name='PDFAnalyzer' component={PDFAnalyzer} />
            <Stack.Screen name='SymptomCheckerScreen' component={SymptomCheckerScreen} />
            {/* <Stack.Screen name='ReportScan' component={ReportScan} /> */}
            <Stack.Screen name='MediLens' component={MediLens} />
          </Stack.Navigator>
        </NavigationContainer>
      </Init>
    </Provider>
  )
}
{/* <Stack.Screen name='HomeScreen' component={HomeScreen} /> */ }

export default App