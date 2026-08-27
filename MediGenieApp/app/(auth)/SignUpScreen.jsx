import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/constants";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import CustomInput from "../../components/CustomInput";
import DefaultButton from "../../components/DefaultButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/thunks/authThunks";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// ✅ Validation schema
const SignUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username too short")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ expo-router navigation

  const handleSignUp = async (values) => {
    try {
      setLoading(true);
      const resultAction = await dispatch(
        registerUser({
          username: values.username,
          email: values.email,
          password1: values.password,
          password2: values.confirmPassword,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        setLoading(false);
        Alert.alert("Success", resultAction.payload.message);
        router.dismissAll();
        router.push({
          pathname: "/EmailVerification",
          params: { from: "SignUpScreen", email: values.email },
        });
      } else {
        setLoading(false);

        const details = resultAction.payload?.error?.details || {};
        const errorMsg =
          details?.email?.[0] ||
          details?.password1?.[0] ||
          resultAction.payload?.error?.message ||
          "Registration failed";
        // console.log(details);

        Alert.alert("Registration Failed", errorMsg);
      }
    } catch (error) {
      setLoading(false);
      console.log("Signup error:", error);
      Alert.alert("Sign up failed", "Something went wrong. Try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black1 }}>
      <KeyboardAvoidingContainer>
        <View style={styles.mainContainer}>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()} // ✅ go back with expo-router
          >
            <Ionicons
              name={"arrow-back-outline"}
              color={colors.lightText}
              size={22}
            />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Let's, Get Started</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignUpSchema}
              onSubmit={(values) => handleSignUp(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
              }) => (
                <>
                  <View>
                    <CustomInput
                      leftIcon={"person-outline"}
                      placeholder="Username"
                      onChangeText={handleChange("username")}
                      onBlur={handleBlur("username")}
                      value={values.username}
                      errorBorder={touched.username && errors.username}
                    />
                    {touched.username && errors.username && (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    )}

                    <CustomInput
                      leftIcon={"mail-outline"}
                      placeholder="Email"
                      keyboardType="email-address"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      autoCapitalize="none"
                      errorBorder={touched.email && errors.email}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    <CustomInput
                      leftIcon="lock-closed-outline"
                      placeholder="Enter Password"
                      secureTextEntry={!showPassword}
                      rightIcon={
                        showPassword ? "eye-off-outline" : "eye-outline"
                      }
                      onRightIconPress={() =>
                        setShowPassword(!showPassword)
                      }
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      autoCapitalize="none"
                      errorBorder={touched.password && errors.password}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    <CustomInput
                      leftIcon="lock-closed-outline"
                      placeholder="Confirm Password"
                      secureTextEntry={true}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      value={values.confirmPassword}
                      autoCapitalize="none"
                      errorBorder={
                        touched.confirmPassword && errors.confirmPassword
                      }
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    )}

                    {/* Terms and Conditions */}
                    <View style={styles.termsRow}>
                      <Text style={styles.termsText}>
                        By continuing, you agree to MediGenie's{" "}
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.push("/TermsConditions")}
                      >
                        <Text style={styles.termsLink}>
                          Terms and Conditions
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View>
                    {/* Submit Button */}
                    <DefaultButton fill onPress={handleSubmit}>
                      SIGN UP
                    </DefaultButton>

                    {/* <Text style={styles.orContinue}>or continue with</Text> */}

                    {/* Google Signup */}
                    {/* <TouchableOpacity style={styles.googleButton}>
                      <Image
                        source={require("../../assets/images/google_ic.png")}
                        style={styles.googleIcon}
                      />
                      <Text style={styles.googleText}>Google</Text>
                    </TouchableOpacity> */}

                    <View style={styles.loginRow}>
                      <Text style={styles.loginText}>
                        Already have an account?{" "}
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.push("/LoginScreen")}
                      >
                        <Text style={styles.loginLink}>Log in</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>

          {/* Loader Modal */}
          <Modal transparent visible={loading} animationType="fade">
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.lightText} />
              <Text style={styles.loaderText}>
                Creating your account...
              </Text>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, padding: 20 },
  backButton: {
    backgroundColor: colors.darkGrey,
    padding: 8,
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: { marginTop: "4%" },
  title: { color: "#fff", fontWeight: "800", fontSize: 24 },
  formContainer: { marginTop: "2%", flex: 1, justifyContent: "space-between" },
  errorText: { color: colors.fail, fontSize: 12, marginLeft: 8 },
  termsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginVertical: 12,
  },
  termsText: { color: colors.lightGrey, fontSize: 14, fontWeight: "500" },
  termsLink: { fontWeight: "bold", color: colors.lightText },
  orContinue: {
    textAlign: "center",
    color: colors.lightGrey,
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 8,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.blue1,
    paddingVertical: 8,
  },
  googleIcon: { height: 20, width: 20, marginRight: 8 },
  googleText: { fontWeight: "bold", fontSize: 16, color: "#fff" },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginText: { color: colors.lightGrey, fontSize: 16, fontWeight: "500" },
  loginLink: { fontWeight: "bold", color: colors.lightText, fontSize: 16 },
  loaderContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
