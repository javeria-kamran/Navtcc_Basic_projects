import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Yup from "yup";
import CustomInput from "../../components/CustomInput";
import DefaultButton from "../../components/DefaultButton";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import { colors } from "../../utils/constants";

const ResetPassword = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
    useFormik({
      initialValues: {
        password: "",
        confirmPassword: "",
      },
      validationSchema,
      onSubmit: (values) => {
        console.log("Password Reset:", values);

        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
          router.replace({
            pathname: "/LoginScreen",
            // params: { from: "EmailVerification"},
          });
          // navigation.reset({
          //   index: 1,
          //   routes: [
          //     { name: "GettingStarted" },
          //     { name: "LoginScreen" },
          //   ],
          // });
        }, 1500);
      },
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black1 }}>
      <KeyboardAvoidingContainer>
        <View style={styles.mainContainer}>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back-outline"
              color={colors.lightText}
              size={22}
            />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Your new password must be unique from those previously used.
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.form}>
            <CustomInput
              leftIcon="lock-closed-outline"
              placeholder="Enter Password"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
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
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              autoCapitalize="none"
              errorBorder={touched.confirmPassword && errors.confirmPassword}
              secureTextEntry={true}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Button */}
          <DefaultButton fill border onPress={handleSubmit}>
            Reset Password
          </DefaultButton>

          {/* Success Modal */}
          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
                <Text style={styles.modalText}>
                  Password Reset Successfully
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    backgroundColor: colors.darkGrey,
    padding: 8,
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: "6%",
    gap: 8,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 26,
  },
  subtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    marginVertical: 24,
    gap: 12,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginLeft: 6,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: colors.darkGrey,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    width: "70%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
});
