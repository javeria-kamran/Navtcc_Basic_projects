import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/constants';
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer';
import CustomInput from '../../components/CustomInput';
import { Formik } from 'formik';
import DefaultButton from '../../components/DefaultButton';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/thunks/authThunks';
import { fetchUser } from '../../redux/slices/userSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginScreen() {
  const [secureTextEntry, setSecureTextEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const resultAction = await dispatch(loginUser(values));

      // router.replace('/(tabs)/Home');
      if (loginUser.fulfilled.match(resultAction)) {
        // ✅ Use expo-router instead of navigation.reset
        router.dismissAll();
        router.replace('/(tabs)/Home');
        dispatch(fetchUser());
      } else {
        const details = resultAction.payload?.error?.details;
        let errorMsg = 'Login failed';
        if (details?.email?.length) errorMsg = details.email[0];
        else if (details?.password?.length) errorMsg = details.password[0];
        Alert.alert('Login Failed', errorMsg);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black1 }}>
      <KeyboardAvoidingContainer>
        <View style={styles.mainContainer}>
          {/* Welcome text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Hey,</Text>
            <Text style={styles.welcomeText}>Welcome back!</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  <View style={styles.inputGroup}>
                    <CustomInput
                      leftIcon="mail-outline"
                      keyboardType="email-address"
                      placeholder="Enter your Email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      autoCapitalize="none"
                      value={values.email}
                      errorBorder={touched.email && errors.email}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    <CustomInput
                      leftIcon="lock-closed-outline"
                      placeholder="Enter your Password"
                      autoCapitalize="none"
                      secureTextEntry={!secureTextEntry}
                      rightIcon={
                        secureTextEntry ? 'eye-off-outline' : 'eye-outline'
                      }
                      onRightIconPress={() =>
                        setSecureTextEntry(!secureTextEntry)
                      }
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      errorBorder={touched.password && errors.password}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    <TouchableOpacity
                      style={styles.forgotPassword}
                      onPress={() => router.push('/(auth)/ForgotPassword')}
                    >
                      <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Buttons & extra actions */}
                  <View>
                    <DefaultButton onPress={handleSubmit} fill>
                      LOG IN
                    </DefaultButton>

                    {/* <Text style={styles.orContinue}>or continue with</Text>

                    <TouchableOpacity style={styles.googleButton}>
                      <Image
                        source={require('../../assets/images/google_ic.png')}
                        style={styles.googleIcon}
                      />
                      <Text style={styles.googleText}>Google</Text>
                    </TouchableOpacity> */}

                    <View style={styles.signupRow}>
                      <Text style={styles.signupText}>
                        Don't have an account?{' '}
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.push('/(auth)/SignUpScreen')}
                      >
                        <Text style={styles.signupLink}>Sign up</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>

          {/* Loader Overlay */}
          <Modal transparent={true} animationType="fade" visible={loading}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.lightText} />
              <Text style={styles.loaderText}>Logging you in...</Text>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    marginTop: '4%',
    gap: 8,
  },
  welcomeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 24,
  },
  formContainer: {
    marginTop: '2%',
    flex: 1,
    justifyContent: 'space-between',
  },
  inputGroup: {
    gap: 4,
  },
  errorText: {
    color: colors.fail,
    fontSize: 12,
    marginLeft: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: colors.lightText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  orContinue: {
    textAlign: 'center',
    color: colors.lightGrey,
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 8,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.blue1,
    paddingVertical: 8,
  },
  googleIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
  },
  googleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    color: colors.lightGrey,
    fontSize: 16,
    fontWeight: '500',
  },
  signupLink: {
    fontWeight: 'bold',
    color: colors.lightText,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
