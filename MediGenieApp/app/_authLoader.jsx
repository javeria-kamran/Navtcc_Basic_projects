import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { loadToken } from '../redux/slices/authSlice';
import { colors } from '@/utils/constants';

export function AuthLoader({ children }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoggedIn, appLoaded } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Simply load token from storage
                await dispatch(loadToken()).unwrap();
            } catch (error) {
                console.log('Failed to load token:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && appLoaded) {
            // Very simple logic:
            // If token exists and user is logged in → go to Home
            // Otherwise, stay on StartScreen
            if (isLoggedIn) {
                console.log('✅ Token found, redirecting to Home');
                setTimeout(() => {
                    router.replace('/(tabs)/Home');
                }, 100);
            } else {
                console.log('ℹ️ No token found, staying on StartScreen');
                // Don't redirect - let user see StartScreen
            }
        }
    }, [isLoading, appLoaded, isLoggedIn, router]);

    // Show loading while checking token
    if (isLoading || !appLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.black1 }}>
                <ActivityIndicator size="large" color={colors.blue1} />
                <Text style={{ color: colors.white, marginTop: 10 }}>
                    Checking authentication...
                </Text>
            </View>
        );
    }

    // Render children once auth check is complete
    return children;
}