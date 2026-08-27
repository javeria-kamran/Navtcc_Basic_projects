// src/screens/ProfileScreen.js
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer';
import MainContainer from '../../components/MainContainer';
import CustomInput from '../../components/CustomInput';
import DefaultButton from '../../components/DefaultButton';
import DropdownComponent from '../../components/DropdownComponent';

import {
  captureImageFromCamera,
  pickImageFromGallery,
  removeProfileImage,
} from '../../redux/slices/profileSlice';
import { updateField } from '../../redux/slices/userSlice';

import { ageOptions, cities, colors, genders } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();

  const profileImage = useSelector((state) => state.profile.profileImage);
  const { user } = useSelector((state) => state.user);
  const params = useLocalSearchParams()

  const [profileUploadModal, setProfileUploadModal] = useState(false);

  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');

  // Load user data from redux
  useEffect(() => {
    if (user?.profile) {
      setUsername(user.profile.name || '');
      setGender(user.profile.gender || '');
      setAge(user.profile.age ? String(user.profile.age) : '');
      setCity(user.profile.city || '');
    }
  }, [user]);

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

  const handleNext = () => {
    const formData = {
      name: username,
      gender,
      age,
      city,
    };

    // Update Redux
    Object.entries(formData).forEach(([field, value]) => {
      dispatch(updateField({ field, value }));
    });

    if (params?.from === 'EmailVerification') {
      router.replace({
        pathname: "screens/MedicalHistory",
        params: { from: "ProfileScreen", profileData: formData, },
      });
      // navigation.navigate('MedicalHistory', {
      //   from: 'ProfileScreen',
      //   profileData: formData,
      // });
    } else {
      router.back();
    }

  };
  // router.push('/ResetPassword')


  return (
    <SafeAreaView style={{
      flex: 1, backgroundColor: colors.black1
    }}>
      <KeyboardAvoidingContainer>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            {/* Profile Image */}
            <View style={styles.profileWrapper}>
              <Image
                source={profileImage || require('../../assets/images/dummy-profile.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => setProfileUploadModal(true)}
              >
                <Ionicons name="camera-outline" size={22} color={colors.black1} />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <CustomInput
                placeholder="Enter your name"
                legendText="Name"
                keyboardType="default"
                startLeft
                value={username}
                onChangeText={setUsername}
              />

              <DropdownComponent
                label="Gender"
                placeholder="Select your gender"
                data={genders}
                value={gender}
                onSelect={setGender}
                startLeft
              />

              <DropdownComponent
                label="Age"
                placeholder="Select your age"
                data={ageOptions}
                value={age}
                onSelect={setAge}
                startLeft
              />

              <DropdownComponent
                label="City"
                placeholder="Select your city"
                data={cities}
                value={city}
                onSelect={setCity}
                startLeft
              />
            </View>

            <DefaultButton fill border onPress={handleNext} title="Submit" />
          </View>

          {/* Modal */}
          <Modal visible={profileUploadModal} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setProfileUploadModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Profile Photo</Text>
                  <View style={styles.modalOptions}>
                    <TouchableOpacity style={styles.modalButton} onPress={handleCamera}>
                      <Ionicons name="camera-outline" size={25} color={colors.blue1} />
                      <Text style={styles.modalText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={handleGallery}>
                      <Ionicons name="image-outline" size={25} color={colors.blue1} />
                      <Text style={styles.modalText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={handleRemove}>
                      <Ionicons name="trash-outline" size={25} color={colors.fail} />
                      <Text style={styles.modalText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView >
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  profileWrapper: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.blue1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.blue1,
  },
  form: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.darkGrey,
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.blue1,
    borderRadius: 10,
    alignItems: 'center',
    width: 90,
  },
  modalText: {
    color: 'white',
    marginTop: 6,
  },
});
