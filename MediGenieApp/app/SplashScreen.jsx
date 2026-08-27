// app/splashscreen.js
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { loadToken } from '../redux/slices/authSlice';
import { colors } from '../utils/constants';
import { fetchUser } from '../redux/slices/userSlice';

export default function SplashScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const hasNavigated = useRef(false);

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Start authentication check
        checkAuthAndNavigate();
    }, []);

    const checkAuthAndNavigate = async () => {
        try {
            console.log('🔍 Checking for existing token...');
            
            // Step 1: Load token from storage
            const tokenResult = await dispatch(loadToken()).unwrap();
            
            if (!tokenResult) {
                console.log('❌ No token found - redirecting to start screen');
                setTimeout(() => navigateToIndex(), 1500);
                return;
            }

            console.log('✅ Token found, fetching user data...');
            
            // Step 2: Try to fetch user data
            try {
                await dispatch(fetchUser()).unwrap();
                console.log('✅ User data fetched successfully - redirecting to home');
                
                // Both conditions met - navigate to Home
                setTimeout(() => navigateToHome(), 1500);
            } catch (userError) {
                console.log('❌ Failed to fetch user:', userError);
                // User fetch failed (token might be invalid/expired)
                setTimeout(() => navigateToIndex(), 1500);
            }
        } catch (tokenError) {
            console.log('❌ Failed to load token:', tokenError);
            setTimeout(() => navigateToIndex(), 1500);
        }
    };

    const navigateToHome = () => {
        if (!hasNavigated.current) {
            hasNavigated.current = true;
            console.log('🚀 Navigating to Home...');
            router.replace('/(tabs)/Home');
        }
    };

    const navigateToIndex = () => {
        if (!hasNavigated.current) {
            hasNavigated.current = true;
            console.log('🚀 Navigating to Start screen...');
            router.replace('/StartScreen');
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.logoContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
});