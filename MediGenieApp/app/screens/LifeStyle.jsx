import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainContainer from "../../components/MainContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { alcoholConsumption, colors, smokingHabits } from "../../utils/constants";
import CustomInput from "../../components/CustomInput";
import DefaultButton from "../../components/DefaultButton";
import { updateField } from "../../redux/slices/userSlice";
import DropdownComponent from "../../components/DropdownComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

const LifeStyle = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const router = useRouter();  
    const params  = useLocalSearchParams();
    const routeName = params?.from;

    // Extract lifestyle fields from Redux
    const { image, lifestyle_type, occupation, smoking, alcohol } = useSelector(
        (state) => state.user
    );

    const handleNext = () => {
        if (routeName === "HealthStatus") {
            router.push({
                pathname: "screens/PersonalGoals",
                params: { from: "LifeStyle" },
            });
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            <KeyboardAvoidingContainer>
                <View style={styles.mainContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back-outline" color={colors.lightText} size={22} />
                        </TouchableOpacity>

                        <Image
                            source={image ? { uri: image } : require("../../assets/images/dummy-profile.png")}
                            style={styles.profileImage}
                        />
                    </View>

                    {/* Title */}
                    <View style={styles.titleWrapper}>
                        <Text style={styles.titleText}>Your Lifestyle & Habits</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Lifestyle Type */}
                        <CustomInput
                            placeholder="Active / Sedentary"
                            legendText="Lifestyle Habits"
                            keyboardType="default"
                            startLeft={true}
                            value={lifestyle_type || ""}
                            onChangeText={(val) =>
                                dispatch(updateField({ field: "lifestyle_type", value: val }))
                            }
                        />

                        {/* Occupation */}
                        <CustomInput
                            placeholder="Desk Job / Field Work / Student"
                            legendText="Occupation"
                            keyboardType="default"
                            startLeft={true}
                            value={occupation || ""}
                            onChangeText={(val) =>
                                dispatch(updateField({ field: "occupation", value: val }))
                            }
                        />

                        {/* Smoking */}
                        <DropdownComponent
                            label="Smoking Habits"
                            placeholder="Yes / No"
                            startLeft={true}
                            data={smokingHabits}
                            value={smoking}
                            onSelect={(val) => dispatch(updateField({ field: "smoking", value: val }))}
                        />

                        {/* Alcohol */}
                        <DropdownComponent
                            label="Alcohol Consumption"
                            placeholder="Yes / No"
                            startLeft={true}
                            data={alcoholConsumption}
                            value={alcohol}
                            onSelect={(val) => dispatch(updateField({ field: "alcohol", value: val }))}
                        />
                    </View>

                    {/* Next Button */}
                    <DefaultButton fill border onPress={handleNext} title="Submit">
                        Next
                    </DefaultButton>
                </View>
            </KeyboardAvoidingContainer>
        </SafeAreaView>
    );
};

export default LifeStyle;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black1,
    },
    mainContainer: { flex: 1, padding: 20 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    backButton: {
        backgroundColor: "#2E2E2E", // dark grey
        padding: 10,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: colors.blue1, // blue1
    },
    titleWrapper: {
        marginTop: "2%",
    },
    titleText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 24,
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
        gap: 12, // only works on RN 0.71+, otherwise use marginBottom on each input
    },
});
