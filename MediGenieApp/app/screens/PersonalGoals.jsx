import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import React from "react";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainContainer from "../../components/MainContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { availableTags, colors } from "../../utils/constants";
import DefaultButton from "../../components/DefaultButton";
import { updateField, updateUserProfile } from "../../redux/slices/userSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const PersonalGoals = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();

  const profileImage = useSelector((state) => state.user.image);
  const selectedTags = useSelector((state) => state.user.personal_goals || []);
  const user = useSelector((state) => state.user);

  const payload = {
    email: user.email,
    name: user.name,
    age: user.age,
    date_of_birth: user.date_of_birth,
    image: user.image,
    gender: user.gender,
    city: user.city,
    chronic_conditions: user.chronic_conditions,
    current_medications: user.current_medications,
    known_allergies: user.known_allergies,
    family_medical_history: user.family_medical_history,
    symptom_pattern: user.symptom_pattern,
    sleep_quality: user.sleep_quality,
    diet_type: user.diet_type,
    lifestyle_type: user.lifestyle_type,
    occupation: user.occupation,
    smoking: user.smoking,
    alcohol: user.alcohol,
  };

  const toggleTag = (tag) => {
    let updated;
    if (selectedTags.includes(tag.value)) {
      updated = selectedTags.filter((t) => t !== tag.value);
    } else {
      updated = [...selectedTags, tag.value];
    }
    dispatch(updateField({ field: "personal_goals", value: updated }));
  };

     const params  = useLocalSearchParams();
     const routeName = params?.from;

  const handleNext = () => {
    if (routeName === "LifeStyle") {
      router.dismissAll()
      router.replace('/(tabs)/Home');
      
      dispatch(updateUserProfile(payload))
        .unwrap()
        .then((res) => {
          console.log("✅Successfully Saved Profile:", res);
          Alert.alert("Success", "Profile saved successfully!");
        })
        .catch((err) => {
          console.error("❌ save failed:", err);
          Alert.alert(
            "Failed Saving Profile",
            typeof err === "string"
              ? err
              : err?.detail ||
              "Something went wrong. Update personal information in profile tab."
          );
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
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../../assets/images/dummy-profile.png")
              }
              style={styles.profileImage}
            />
          </View>

          {/* Title */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>Your Goals Tag</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsWrapper}>
            <View style={styles.tagsRow}>
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.value);
                return (
                  <TouchableOpacity
                    key={tag.value}
                    onPress={() => toggleTag(tag)}
                    style={[
                      styles.tag,
                      { backgroundColor: isSelected ? colors.blue1 : "#2E2E2E" },
                    ]}
                  >
                    <Text
                      style={{
                        color: isSelected ? colors.black1 : colors.lightText,
                        fontWeight: "600",
                      }}
                    >
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submit */}
          <DefaultButton fill border onPress={handleNext} title="Submit" />
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
};

export default PersonalGoals;

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
    borderColor: colors.blue1,
  },
  titleWrapper: {
    marginTop: "2%",
  },
  titleText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 24,
  },
  tagsWrapper: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // if not supported in your RN version, replace with marginRight + marginBottom
    marginBottom: 20,
  },
  tag: {
    borderRadius: 12,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
});
