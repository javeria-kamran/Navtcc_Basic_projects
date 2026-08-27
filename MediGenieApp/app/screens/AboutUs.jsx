import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import KeyboardAvoidingContainer from '../../components/KeyboardAvoidingContainer';
import MainContainer from '../../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const AboutUs = () => {
  const imageURI = require('../../assets/images/logoBlack.png');
  const profileImage = require('../../assets/images/dummy-profile.png');
  const navigation = useNavigation();

  const teamMembers = [
    {
      name: 'Abdul Rafay Atiq',
      role: 'Backend Developer'
    },
    {
      name: 'Iqra Shahid',
      role: 'UI/UX Designer'
    },
    {
      name: 'Minahil Moiz',
      role: 'Frontend Developer'
    },
    {
      name: 'Huzaifa Ali',
      role: 'Technical Writer'
    }
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black1 }}>
      <KeyboardAvoidingContainer>
        <View style={styles.mainContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" color={colors.lightText} size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>About Us</Text>
          </View>

          {/* Card */}
          <View style={styles.introCard}>
            <View style={styles.introTextWrapper}>
              <Text style={styles.introTitle}>MediGenie</Text>
              <Text style={styles.introSubtitle}>Your Health, simplified with AI.</Text>
            </View>
            <Image source={imageURI} style={styles.introImage} />
          </View>

          {/* Who We Are */}
          <View style={styles.section}>
            <Ionicons name="people-outline" color={colors.lightText} size={25} />
            <Text style={styles.sectionTitle}>Who We are?</Text>
            <Text style={styles.sectionText}>
              At MediGenie, we’re a passionate team of healthcare professionals, AI engineers, and
              data scientists united by one goal: to make world-class medical insight accessible to
              everyone. Combining years of clinical expertise with cutting-edge machine learning, we
              empower you with fast, reliable health assessments right on your device.
            </Text>
          </View>

          {/* Our Work */}
          <View style={styles.section}>
            <Ionicons name="globe-outline" color={colors.lightText} size={25} />
            <Text style={styles.sectionTitle}>Our Work</Text>
            <Text style={styles.sectionSubtitle}>Data-Driven Diagnosis</Text>
            <Text style={styles.sectionText}>
              We analyze your symptoms and uploaded reports using deep-learning models trained on
              millions of anonymized medical records—ensuring each suggestion is personalized and
              evidence-based.
            </Text>
            <Text style={styles.sectionSubtitle}>Interactive Guidance</Text>
            <Text style={styles.sectionText}>
              Our intuitive chatbot clarifies uncertainties, and recommends next steps, just like a
              real health coach.
            </Text>
          </View>

          {/* Values */}
          <View style={styles.valuesWrapper}>
            <View style={styles.valueCard}>
              <Ionicons name="heart-outline" color={colors.lightText} size={25} />
              <Text style={styles.valueTitle}>Empathy</Text>
              <Text style={styles.valueText}>Keeping Human heart in the hand of technology.</Text>
            </View>

            <View style={styles.valueCard}>
              <Ionicons name="phone-portrait-outline" color={colors.lightText} size={25} />
              <Text style={styles.valueTitle}>Accessibility</Text>
              <Text style={styles.valueText}>Helping people to get healthcare support.</Text>
            </View>

            <View style={styles.valueCard}>
              <Ionicons name="checkmark-circle-outline" color={colors.lightText} size={25} />
              <Text style={styles.valueTitle}>Accuracy</Text>
              <Text style={styles.valueText}>Ensuring precision in every output.</Text>
            </View>

            <View style={styles.valueCard}>
              <MaterialCommunityIcons name="lightbulb-on-outline" color={colors.lightText} size={25} />
              <Text style={styles.valueTitle}>Innovation</Text>
              <Text style={styles.valueText}>Pioneering AI solutions for healthcare.</Text>
            </View>
          </View>

          {/* Team */}
          <Text style={styles.teamHeading}>Our Team</Text>
          <View style={styles.teamWrapper}>
            {teamMembers.map((item, index) => (
              <View key={index} style={styles.teamCard}>
                <Image source={profileImage} style={styles.teamImage} />
                <Text style={styles.teamName}>{item.name}</Text>
                <Text style={styles.teamRole}>{item.role}</Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>copyright@2025 | MediGenie</Text>
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
  header: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    backgroundColor: colors.darkGrey,
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.lightText,
    fontSize: 22,
    fontWeight: '800',
  },
  introCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.blue1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  introTextWrapper: {
    flex: 1,
    marginRight: 12,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  introSubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#fff',
  },
  introImage: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightText,
    marginVertical: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: colors.lightText,
  },
  sectionText: {
    fontSize: 14,
    color: colors.lightText,
    lineHeight: 20,
  },
  valuesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  valueCard: {
    borderWidth: 1,
    borderColor: colors.blue1,
    borderRadius: 8,
    width: 140,
    padding: 12,
    alignItems: 'center',
    margin: 6,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 6,
    color: colors.lightText,
  },
  valueText: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightText,
  },
  teamHeading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
    color: '#fff',
  },
  teamWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  teamCard: {
    alignItems: 'center',
    margin: 10,
  },
  teamImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.blue1,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  teamRole: {
    fontSize: 12,
    color: '#ccc',
  },
  footer: {
    fontSize: 12,
    color: colors.lightGrey,
    textAlign: 'center',
    marginVertical: 12,
  },
});

export default AboutUs;
