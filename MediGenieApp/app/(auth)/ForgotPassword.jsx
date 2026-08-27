import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import MainContainer from "../../components/MainContainer";
import DefaultButton from "../../components/DefaultButton";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/constants";
import CustomInput from "../../components/CustomInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleEmailInput = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setEmailError("Email is required");
            return;
        } else if (!emailRegex.test(email)) {
            setEmailError("Enter a valid email address");
            return;
        }
        router.push({
          pathname: "/EmailVerification",
          params: { from: "ForgotPassword", email: email },
        });
        // navigation.navigate("EmailVerification", { from: "ForgotPassword" });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.black1 }}>
        <KeyboardAvoidingContainer>
            <View style={styles.mainContainer}>
                {/* Back Button */}
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
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Don&apos;t worry! It occurs. Please enter the email address linked
                        with your account.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View>
                        <CustomInput
                            leftIcon="mail-outline"
                            keyboardType="email-address"
                            placeholder="Enter your Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text.trim().toLowerCase());
                                setEmailError("");
                            }}
                            autoCapitalize="none"
                        />
                        {emailError !== "" && (
                            <Text style={styles.errorText}>{emailError}</Text>
                        )}
                    </View>

                    <DefaultButton fill border onPress={handleEmailInput}>
                        Send Code
                    </DefaultButton>
                </View>
            </View>
        </KeyboardAvoidingContainer>
        </SafeAreaView>
    );
};

export default ForgotPassword;

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
        marginTop: "4%",
        gap: 8,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    title: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 28,
    },
    subtitle: {
        color: "#fff",
        fontSize: 14,
    },
    form: {
        marginTop: "6%",
        gap: 24,
    },
    errorText: {
        color: colors.fail,
        fontSize: 13,
        marginLeft: 6,
        marginTop: 4,
    },
});
