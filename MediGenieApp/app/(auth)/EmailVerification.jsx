import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import MainContainer from "../../components/MainContainer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import DefaultButton from "../../components/DefaultButton";
import { OtpInput } from "react-native-otp-entry";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../redux/thunks/authThunks";
import { loadToken, resetOtp } from "../../redux/slices/authSlice";
import { fetchUser } from "../../redux/slices/userSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

const EmailVerification = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const params = useLocalSearchParams()
    const dispatch = useDispatch();

    const { loading, otpVerified, otpMessage, error } = useSelector(
        (state) => state.auth
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [OTPtext, setOTPtext] = useState("");
    const [resendDisabled, setResendDisabled] = useState(false);
    const [timer, setTimer] = useState(0);

    const routeName = params?.from;
    const userEmail = params?.email;
    // console.log(routeName, userEmail);

    // 🔹 Handle OTP verification
    const handleVerification = async () => {
        if (!OTPtext) return;

        const resultAction = await dispatch(
            verifyOtp({ email: userEmail, code: OTPtext })
        );

        if (verifyOtp.fulfilled.match(resultAction)) {
            setModalSuccess(true);
            setModalVisible(true);

            setTimeout(() => {
                setModalVisible(false);
                dispatch(resetOtp());
                dispatch(loadToken()).then(() => {
                    dispatch(fetchUser());
                });
                if (routeName === "SignUpScreen") {
                    console.log(resultAction?.payload);
                    router.dismissAll();
                    router.replace({
                        pathname: "screens/ProfileScreen",
                        params: { from: "EmailVerification", data: resultAction?.payload },
                    });
                    // navigation.reset({
                    //     index: 0,
                    //     routes: [
                    //         {
                    //             name: "ProfileScreen",
                    //             from: "EmailVerification",
                    //             data: resultAction?.payload,
                    //         },
                    //     ],
                    // });
                } else {
                    // navigation.navigate("ResetPassword");
                    router.push('/ResetPassword')
                }
            }, 1500);
        } else {
            setModalSuccess(false);
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
            }, 1500);
        }
    };

    // 🔹 Resend timer logic
    useEffect(() => {
        let interval;
        if (resendDisabled) {
            setTimer(60);
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendDisabled]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.black1 }}>
            <KeyboardAvoidingContainer>
                <View style={styles.mainContainer}>
                    {/* Back button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" color={colors.lightText} size={22} />
                    </TouchableOpacity>

                    {/* Title */}
                    <View style={styles.header}>
                        <Text style={styles.title}>OTP Verification</Text>
                        <Text style={styles.subtitle}>
                            Enter the 4-digit code sent to {userEmail}
                        </Text>
                    </View>

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        <OtpInput
                            numberOfDigits={4}
                            focusColor="#22d3ee"
                            blurOnFilled={true}
                            type="numeric"
                            onFilled={(text) => setOTPtext(text)}
                            theme={{
                                containerStyle: styles.otpInputWrapper,
                                pinCodeContainerStyle: styles.pinBox,
                                focusedPinCodeContainerStyle: styles.pinBoxFocused,
                                pinCodeTextStyle: styles.pinText,
                            }}
                        />
                    </View>

                    {/* Verify + Resend */}
                    <View style={styles.actions}>
                        <DefaultButton fill border onPress={handleVerification}>
                            {loading ? "Verifying..." : "Verify"}
                        </DefaultButton>

                        <View style={styles.resendRow}>
                            <Text style={styles.resendText}>Didn&apos;t receive code? </Text>
                            <TouchableOpacity
                                onPress={() => setResendDisabled(true)}
                                disabled={resendDisabled}
                            >
                                <Text style={styles.resendLink}>Resend</Text>
                            </TouchableOpacity>
                        </View>
                        {resendDisabled && (
                            <Text style={styles.timerText}>
                                You can resend code in {timer}s
                            </Text>
                        )}
                    </View>

                    {/* Modal */}
                    <Modal visible={modalVisible} transparent animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalBox}>
                                <Ionicons
                                    name={modalSuccess ? "checkmark-circle" : "close-circle"}
                                    size={64}
                                    color={modalSuccess ? colors.success : colors.fail}
                                />
                                <Text style={styles.modalText}>
                                    {modalSuccess
                                        ? otpMessage || "OTP Verified"
                                        : error?.message || "Invalid OTP"}
                                </Text>
                            </View>
                        </View>
                    </Modal>
                </View>
            </KeyboardAvoidingContainer>
        </SafeAreaView>
    );
};

export default EmailVerification;

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
    },
    otpContainer: {
        marginTop: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    otpInputWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        marginTop: 20,
    },
    pinBox: {
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 12,
        width: 50,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 6,
    },
    pinBoxFocused: {
        borderColor: "#22d3ee",
        borderWidth: 2,
    },
    pinText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    actions: {
        marginTop: "12%",
    },
    resendRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },
    resendText: {
        color: colors.lightGrey,
        fontSize: 14,
        fontWeight: "500",
    },
    resendLink: {
        fontWeight: "bold",
        color: colors.lightText,
        fontSize: 14,
    },
    timerText: {
        textAlign: "center",
        color: colors.lightText,
        fontSize: 13,
        marginTop: 6,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalBox: {
        backgroundColor: colors.darkGrey,
        padding: 24,
        borderRadius: 20,
        alignItems: "center",
        width: "70%",
    },
    modalText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        textAlign: "center",
    },
});
