import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput";
import DefaultButton from "../../components/DefaultButton";
import DropdownComponent from "../../components/DropdownComponent";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import { updateField } from "../../redux/slices/userSlice";
import { colors, sleepQuality } from "../../utils/constants";

const HealthStatus = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const router = useRouter();
  const params  = useLocalSearchParams();
  const routeName = params?.from;

  const { image, symptom_pattern, sleep_quality, diet_type } = useSelector(
    (state) => state.user
  );

  const handleNext = () => {
    if (routeName === "MedicalHistory") {
      router.push({
        pathname: "screens/LifeStyle",
        params: { from: "HealthStatus" },
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

            <Image
              source={
                image
                  ? { uri: image }
                  : require("../../assets/images/dummy-profile.png")
              }
              style={styles.profileImage}
            />
          </View>

          {/* Title */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>Your Health Status</Text>
          </View>

          {/* Form */}
          <View style={styles.formWrapper}>
            {/* Symptom Pattern */}
            <CustomInput
              placeholder="E.g. frequent headache , joint pain etc"
              legendText="Symptoms pattern"
              keyboardType="default"
              startLeft={true}
              value={symptom_pattern || ""}
              onChangeText={(val) =>
                dispatch(updateField({ field: "symptom_pattern", value: val }))
              }
            />

            {/* Sleep Quality */}
            <DropdownComponent
              label="Sleep Quality"
              placeholder="Select your sleep quality."
              startLeft={true}
              data={sleepQuality}
              value={sleep_quality || ""}
              onSelect={(val) =>
                dispatch(updateField({ field: "sleep_quality", value: val }))
              }
            />

            {/* Diet Type */}
            <CustomInput
              placeholder="Vegetarian / High protein / Junk food etc"
              legendText="Diet Type"
              keyboardType="default"
              startLeft={true}
              value={diet_type || ""}
              onChangeText={(val) =>
                dispatch(updateField({ field: "diet_type", value: val }))
              }
            />
          </View>

          {/* Next Button */}
          <View style={styles.buttonWrapper}>
            <DefaultButton
              fill
              border
              onPress={handleNext}
              title="Next"
            />
          </View>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
};

export default HealthStatus;

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
  formWrapper: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  buttonWrapper: {
    marginTop: 24,
  },
});
