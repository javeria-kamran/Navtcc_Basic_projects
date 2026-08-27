import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainContainer from "../../components/MainContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../utils/constants";
import CustomInput from "../../components/CustomInput";
import DefaultButton from "../../components/DefaultButton";
import { updateField } from "../../redux/slices/userSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const MedicalHistory = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();

  const params = useLocalSearchParams();
  const routeName = params?.from;

  const profileImage = useSelector((state) => state.profile.profileImage);

  const {
    chronic_conditions,
    current_medications,
    known_allergies,
    family_medical_history,
  } = useSelector((state) => state.user);

  const handleNext = () => {
    if (routeName === "ProfileScreen") {
      router.push({
        pathname: "screens/HealthStatus",
        params: { from: "MedicalHistory" },
      });
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black1 }}>
      <KeyboardAvoidingContainer>
        <View style={styles.mainContainer}>
          {/* Header */}
          <View style={styles.header}>
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

            <Image source={profileImage} style={styles.profileImage} />
          </View>

          {/* Title */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>Your Medical History</Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputsWrapper}>
            <CustomInput
              placeholder="e.g. Diabetes or type None"
              legendText="Chronic conditions"
              keyboardType="default"
              startLeft={true}
              value={chronic_conditions || ""}
              onChangeText={(text) =>
                dispatch(
                  updateField({ field: "chronic_conditions", value: text })
                )
              }
            />

            <CustomInput
              placeholder="e.g. Paracetamol or type 'None'"
              legendText="Current Medication ( if any )"
              keyboardType="default"
              startLeft={true}
              value={current_medications || ""}
              onChangeText={(text) =>
                dispatch(
                  updateField({ field: "current_medications", value: text })
                )
              }
            />

            <CustomInput
              placeholder="e.g. Penicillin, or type 'None'"
              legendText="Known allergies ( if any )"
              keyboardType="default"
              startLeft={true}
              value={known_allergies || ""}
              onChangeText={(text) =>
                dispatch(
                  updateField({ field: "known_allergies", value: text })
                )
              }
            />

            <CustomInput
              placeholder="e.g. Asthma, or type 'None'"
              legendText="Family Medical History ( if any )"
              keyboardType="default"
              startLeft={true}
              value={family_medical_history || ""}
              onChangeText={(text) =>
                dispatch(
                  updateField({
                    field: "family_medical_history",
                    value: text,
                  })
                )
              }
            />
          </View>

          {/* Button */}
          <View style={styles.buttonWrapper}>
            <DefaultButton
              fill
              border
              onPress={handleNext}
              title={routeName === "ProfileScreen" ? "Next" : "Save"}
            />
          </View>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
};

export default MedicalHistory;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black1,
  },
  mainContainer: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    backgroundColor: colors.darkGrey,
    padding: 12,
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.blue1,
  },
  titleWrapper: {
    marginTop: 16,
  },
  titleText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  inputsWrapper: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  buttonWrapper: {
    marginTop: 24,
  },
});
