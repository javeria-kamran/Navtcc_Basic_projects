import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import React, { use } from "react";
import MainContainer from "../../components/MainContainer";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const TermsConditions = () => {
    const navigation = useNavigation();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerWrapper}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" color={colors.lightText} size={22} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Terms & Conditions</Text>
            </View>

            {/* Content */}
            <KeyboardAvoidingContainer>
                <View style={styles.mainContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.paragraph}>
                            Welcome to MediGenie! By using our app, you agree to the following terms and conditions. Please read them carefully before proceeding.
                        </Text>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                            <Text style={styles.sectionText}>
                                By accessing or using MediGenius, you agree to be bound by these Terms and Conditions, as well as our Privacy Policy. If you do not agree, please do not use our services.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>2. Use of the App</Text>
                            <Text style={styles.sectionText}>
                                MediGenius is designed for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
                            <Text style={styles.sectionText}>You are responsible for maintaining the confidentiality of your account and password.</Text>
                            <Text style={styles.sectionText}>All information provided must be accurate and complete. Misuse of the app is strictly prohibited.</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4. Medical Disclaimer</Text>
                            <Text style={styles.sectionText}>MediGenius does not provide medical advice, diagnosis, or treatment. Always consult a healthcare professional for medical concerns.</Text>
                            <Text style={styles.sectionText}>Any information provided by MediGenius is for reference only and should not be relied upon for critical health decisions.</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
                            <Text style={styles.sectionText}>All content, features, and functionality in MediGenius are owned by MediGenius and protected by copyright and trademark laws.</Text>
                            <Text style={styles.sectionText}>Unauthorized use, reproduction, or distribution of any content is prohibited.</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
                            <Text style={styles.sectionText}>MediGenius is not liable for any damages or losses resulting from the use of our app.</Text>
                            <Text style={styles.sectionText}>The app is provided "as is" without any warranties of any kind.</Text>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingContainer>
        </SafeAreaView>
    );
};

export default TermsConditions;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: colors.black1,
    },
    headerWrapper: {
        marginTop: "5%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.blue1
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
    headerText: {
        flex: 1,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        marginRight: 48, // balance the back button space
    },
    scrollContent: {
        paddingVertical: 16,
        paddingHorizontal: 10,
        gap: 16,
    },
    paragraph: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 20,
        textAlign: "justify",
    },
    section: {
        marginTop: 12,
    },
    sectionTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 6,
    },
    sectionText: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 20,
        paddingLeft: 8,
        marginBottom: 4,
        textAlign: "justify",
    },
});
