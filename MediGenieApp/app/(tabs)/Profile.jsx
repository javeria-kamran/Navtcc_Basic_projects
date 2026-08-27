import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import KeyboardAvoidingContainer from "../../components/KeyboardAvoidingContainer";
import MainContainer from "../../components/MainContainer";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { colors } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  captureImageFromCamera,
  pickImageFromGallery,
  removeProfileImage,
} from "../../redux/slices/profileSlice";
import { useNavigation } from "@react-navigation/native";
import { updateUserProfile } from "../../redux/slices/userSlice";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const imageURI = require("../../assets/images/dummy-profile.png");
  const navigation = useNavigation();
  const [profileUploadModal, setProfileUploadModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const profileImage = useSelector((state) => state.profile.profileImage);
  const user = useSelector((state) => state.user);

  const handleCamera = async () => {
    dispatch(captureImageFromCamera())
      .unwrap()
      .then(() => setProfileUploadModal(false))
      .catch((e) => console.warn(e));
  };

  const handleGallery = async () => {
    dispatch(pickImageFromGallery())
      .unwrap()
      .then(() => setProfileUploadModal(false))
      .catch((e) => console.warn(e));
  };

  const handleRemove = () => {
    dispatch(removeProfileImage());
    setProfileUploadModal(false);
  };

  const handleUpdate = () => {
    if (isEditing) {
      const payload = { ...user };
      dispatch(updateUserProfile(payload))
        .unwrap()
        .then(() => {
          Alert.alert("Success", "Profile updated successfully!");
        })
        .catch((err) => {
          Alert.alert(
            "Update Failed",
            typeof err === "string"
              ? err
              : err?.detail || "Something went wrong. Please try again."
          );
        });
    }
    setIsEditing(!isEditing);
  };

  const renderRow = (label, value) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          !value ? styles.rowValueItalic : undefined,
        ]}
      >
        {value || "Not Updated"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']}  style={{ flex: 1, backgroundColor: colors.black1 }}>
      <KeyboardAvoidingContainer>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>User Profile</Text>
              <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                <Text style={styles.updateBtnText}>
                  {isEditing ? "Done" : "Update"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image
                source={profileImage || imageURI}
                style={styles.avatar}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => setProfileUploadModal(true)}
              >
                <Ionicons name="camera-outline" size={16} color={colors.black1} />
              </TouchableOpacity>
            </View>

            {/* Basic Info */}
            <View style={styles.card}>
              {renderRow("Email", user?.email)}
              {renderRow("Role", user?.role || "User")}
            </View>

            {/* Profile Info */}
            <View style={styles.card}>
              {isEditing && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push("/screens/ProfileScreen")}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                  <AntDesign name="edit" size={12} color="#ffffff" />
                </TouchableOpacity>
              )}
              {renderRow("Name", user?.name)}
              {renderRow("Gender", user?.gender)}
              {renderRow("Age", user?.age)}
              {renderRow("City", user?.city)}
            </View>

            {/* Medical History */}
            <View style={styles.card}>
              {isEditing && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push("/screens/MedicalHistory")}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                  <AntDesign name="edit" size={12} color="#ffffff" />
                </TouchableOpacity>
              )}
              {renderRow("Chronic conditions", user?.chronic_conditions)}
              {renderRow("Current medications", user?.current_medications)}
              {renderRow("Known allergies", user?.known_allergies)}
              {renderRow("Family Medical History", user?.family_medical_history)}
            </View>

            {/* Health Status */}
            <View style={styles.card}>
              {isEditing && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push("/screens/HealthStatus")}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                  <AntDesign name="edit" size={12} color="#ffffff" />
                </TouchableOpacity>
              )}
              {renderRow("Symptoms pattern", user?.symptom_pattern)}
              {renderRow("Sleep quality", user?.sleep_quality)}
              {renderRow("Diet type", user?.diet_type)}
            </View>

            {/* Lifestyle */}
            <View style={styles.card}>
              {isEditing && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push("/screens/LifeStyle")}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                  <AntDesign name="edit" size={12} color="#ffffff" />
                </TouchableOpacity>
              )}
              {renderRow("Lifestyle habits", user?.lifestyle_type)}
              {renderRow("Occupation", user?.occupation)}
              {renderRow("Smoking habits", user?.smoking ? "Yes" : "No")}
              {renderRow("Alcohol consumption", user?.alcohol ? "Yes" : "No")}
            </View>

            {/* Personal Goals */}
            <View style={styles.card}>
              {isEditing && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push("/screens/PersonalGoals")}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                  <AntDesign name="edit" size={12} color="#ffffff" />
                </TouchableOpacity>
              )}
              <Text style={styles.sectionLabel}>Personal Goals</Text>
              <View style={styles.tagsWrapper}>
                {user?.personal_goals?.map((goal, index) => (
                  <Text key={index} style={styles.tag}>
                    {goal}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Profile Upload Modal */}
          <Modal visible={profileUploadModal} transparent animationType="fade">
            <TouchableWithoutFeedback
              onPress={() => setProfileUploadModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>Profile Photo</Text>
                  <View style={styles.modalBtns}>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={handleCamera}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={25}
                        color={colors.blue1}
                      />
                      <Text style={styles.modalBtnText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={handleGallery}
                    >
                      <Ionicons
                        name="image-outline"
                        size={25}
                        color={colors.blue1}
                      />
                      <Text style={styles.modalBtnText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={handleRemove}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={25}
                        color={colors.fail}
                      />
                      <Text style={styles.modalBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", width: "100%" },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 8,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", color: colors.lightText },
  updateBtn: {
    backgroundColor: colors.blue1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  updateBtnText: { fontWeight: "bold", color: colors.black1 },
  avatarContainer: {
    width: 80,
    height: 80,
    marginVertical: 16,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.blue1,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.blue1,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    padding: 12,
    borderRadius: 16,
    width: "100%",
    marginVertical: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2c",
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  rowLabel: { color: "white", fontWeight: "bold", width: "50%" },
  rowValue: { color: "white", width: "50%" },
  rowValueItalic: { fontStyle: "italic", color: "white" },
  editBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: colors.black1,
    zIndex: 10,
  },
  editBtnText: { color: "white", fontSize: 12, marginRight: 4 },
  sectionLabel: { color: "white", fontWeight: "bold", marginBottom: 8 },
  tagsWrapper: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  tag: {
    backgroundColor: colors.blue1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    color: colors.black1,
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: colors.darkGrey,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    width: "100%",
  },
  modalBtn: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.blue1,
  },
  modalBtnText: { color: "white", marginTop: 6 },
});

export default Profile;
