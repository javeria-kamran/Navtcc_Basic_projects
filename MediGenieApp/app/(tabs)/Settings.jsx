import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React from 'react';
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer';
import MainContainer from '../../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/thunks/authThunks';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutUser());

      if (logoutUser.fulfilled.match(resultAction)) {
        router.replace('/(auth)/LoginScreen');
      } else {
        const errorMsg = resultAction.payload?.message || 'Logout failed';
        Alert.alert('Logout Error', errorMsg);
      }
    } catch (error) {
      Alert.alert('Logout Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']}  style={{ flex: 1, backgroundColor: colors.black1 }}>
      <KeyboardAvoidingContainer>
        <View style={styles.mainContainer}>
          <Text style={styles.heading}>Settings</Text>

          <View style={styles.card}>
            {/* About Us */}
            <TouchableOpacity
              style={styles.option}
              onPress={() => router.push('/screens/AboutUs')}
            >
              <Ionicons name={'information-circle-outline'} color={'#ffffff'} size={22} />
              <Text style={styles.optionText}>About Us</Text>
            </TouchableOpacity>

            {/* Update Profile */}
            <TouchableOpacity
              style={styles.option}
              onPress={() => router.push('/Profile')}
            >
              <Ionicons name={'settings-outline'} color={'#ffffff'} size={22} />
              <Text style={styles.optionText}>Update</Text>
            </TouchableOpacity>

            {/* Delete Profile */}
            <TouchableOpacity style={styles.option} onPress={handleLogout}>
              <Ionicons name={'person-remove-outline'} color={'#ffffff'} size={22} />
              <Text style={styles.optionText}>Delete Profile</Text>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity style={styles.option} onPress={handleLogout}>
              <Ionicons name={'log-out-outline'} color={colors.fail} size={22} />
              <Text style={styles.optionText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    color: colors.lightText,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 22,
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    padding: 12,
    borderRadius: 16,
    marginVertical: 16,
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46', // zinc-700
  },
  optionText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default SettingsScreen;
