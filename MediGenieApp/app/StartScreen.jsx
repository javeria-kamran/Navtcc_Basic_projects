// app/StartScreen.js
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../utils/constants'
import { useRouter } from 'expo-router';
// import { useRouter } from '../components/MainContainer'

export default function StartScreen() {
    const imageURI = require('../assets/images/logo.png');
    const router = useRouter();

    const handleLogin = () => {
        router.push('(auth)/LoginScreen');
    };

    const handleSignUp = () => {
        router.push('(auth)/SignUpScreen');
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={imageURI} style={styles.logo} />
                    <Text style={styles.title}>MediGenie</Text>
                    <Text style={styles.subtitle}>
                        Where AI Meets Personalized Healthcare
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
                        <Text style={styles.loginText}>LOG IN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
                        <Text style={styles.signUpText}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.black1,
        flex: 1,
        padding: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
        width: '80%'
    },
    logo: {
        height: 144,
        width: 144,
        marginBottom: 8,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    subtitle: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '80%',
        position: 'absolute',
        bottom: '5%',
        justifyContent: 'center',
        backgroundColor: colors.darkGrey,
        borderRadius: 48,
        borderWidth: 1,
        borderColor: colors.blue1,
        overflow: 'hidden',
    },
    button: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: colors.blue1,
        borderRadius: 48,
    },
    signUpButton: {
        backgroundColor: colors.darkGrey,
    },
    loginText: {
        color: colors.black1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});