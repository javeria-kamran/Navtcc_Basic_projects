import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/thunks/authThunks";
import { colors } from "../../utils/constants";

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const profileImage = useSelector((state) => state.profile.profileImage);
    const userName = useSelector((state) => state.user.name);
    const [modal, setModal] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogout = async () => {
        try {
            const resultAction = await dispatch(logoutUser());
            if (logoutUser.fulfilled.match(resultAction)) {
                router.replace("/(auth)/LoginScreen");
            } else {
                const errorMsg = resultAction.payload?.message || "Logout failed";
                Alert.alert("Logout Error", errorMsg);
            }
        } catch (error) {
            Alert.alert("Logout Error", "Something went wrong");
        }
    };

    const features = [
        {
            id: 1,
            title: "MedIntel AI",
            description: "AI-powered medical research assistant for instant symptom analysis and health insights",
            icon: "search",
            iconType: "ionicons",
            color: colors.blue1, // Changed to theme color
            accent: colors.darkGrey, // Changed to theme color
            route: "/screens/ResearchAssisstantScreen",
        },
        {
            id: 2,
            title: "DocIntel AI",
            description: "Upload and organize medical reports with AI-powered analysis and insights",
            icon: "document-text",
            iconType: "ionicons",
            color: colors.blue1, // Changed to theme color
            accent: colors.darkGrey, // Changed to theme color
            route: "/screens/MediLens",
        },
        {
            id: 3,
            title: "Derm AI",
            description: "Skin analysis with AI dermatology for instant condition assessment",
            icon: "camera",
            iconType: "ionicons",
            color: colors.blue1, // Changed to theme color (or use another theme color)
            accent: colors.darkGrey, // Changed to theme color
            route: "/screens/DermIQ",
        },
        {
            id: 4,
            title: "PsyCare AI",
            description: "Mental health support with empathetic AI therapy and guidance",
            icon: "heart",
            iconType: "fontawesome5",
            color: colors.blue1, // Changed to theme color (or use another theme color)
            accent: colors.darkGrey, // Changed to theme color
            route: "/screens/AiTherapico",
        },
    ];

    const FeatureCard = ({ feature, index }) => {
        const cardAnim = useRef(new Animated.Value(0)).current;

        React.useEffect(() => {
            Animated.spring(cardAnim, {
                toValue: 1,
                delay: index * 100,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        }, []);

        const scale = cardAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1]
        });

        return (
            <Animated.View style={{ transform: [{ scale }] }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push(feature.route)}
                    style={[styles.featureCard, { backgroundColor: feature.accent, borderLeftColor: feature.color }]}
                >
                    <View style={styles.featureContent}>
                        <View style={styles.featureHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                                {feature.iconType === 'fontawesome5' ? (
                                    <FontAwesome5 name={feature.icon} size={24} color="#fff" />
                                ) : (
                                    <Ionicons name={feature.icon} size={24} color="#fff" />
                                )}
                            </View>
                            <View style={styles.featureTitleContainer}>
                                <Text style={[styles.featureTitle, { color: feature.color }]}>{feature.title}</Text>
                                <Text style={styles.featureDescription} numberOfLines={2}>
                                    {feature.description}
                                </Text>
                                <View style={styles.featureStats}>
                                    <View style={styles.statItem}>
                                        <Ionicons name="flash" size={12} color={feature.color} />
                                        <Text style={[styles.statText, { color: feature.color }]}>AI-Powered</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <Ionicons name="shield-checkmark" size={12} color={feature.color} />
                                        <Text style={[styles.statText, { color: feature.color }]}>Secure</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.featureFooter}>
                            {/* <TouchableOpacity style={[styles.tryNowButton, { backgroundColor: feature.color }]}>
                                <Text style={styles.tryNowText}>Try Now</Text>
                                <Ionicons name="arrow-forward" size={16} color="#fff" />
                            </TouchableOpacity> */}

                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
            {/* Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <View style={styles.headerBackground}>
                    <View style={styles.headerContent}>
                        <View style={styles.profileSection}>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={profileImage || require("../../assets/images/dummy-profile.png")}
                                    style={styles.profileImage}
                                />
                                <View style={styles.onlineIndicator} />
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.greetingText}>Good {getGreetingTime()},</Text>
                                <Text style={styles.userName}>{userName || 'User'}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => setModal((prev) => !prev)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="ellipsis-horizontal" color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Dropdown menu */}
                    {modal && (
                        <Animated.View
                            style={[
                                styles.dropdownMenu,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => router.push("/screens/AboutUs")}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="information-circle" color="#4FC3F7" size={22} />
                                <Text style={styles.dropdownText}>About Us</Text>
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={handleLogout}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="log-out" color="#FF6B6B" size={22} />
                                <Text style={[styles.dropdownText, { color: '#FF6B6B' }]}>Log Out</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </Animated.View>

            {/* Main Content */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Welcome Card */}
                <Animated.View
                    style={[
                        styles.welcomeCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.welcomeCardBackground}>
                        <View style={styles.welcomeContent}>
                            <View style={styles.welcomeTextContainer}>
                                <Text style={styles.welcomeTitle}>MediGenie AI</Text>
                                <Text style={styles.welcomeSubtitle}>
                                    Your intelligent health companion powered by advanced AI
                                </Text>
                            </View>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require("../../assets/images/logo.png")}
                                    style={{ width: 40, height: 40 }}
                                />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Features Section */}
                <View style={styles.featuresSection}>
                    <View style={styles.sectionHeader}>
                        {/* <Text style={styles.sectionTitle}>AI Health Tools</Text> */}
                    </View>

                    <View style={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <FeatureCard key={feature.id} feature={feature} index={index} />
                        ))}
                    </View>
                </View>

                {/* Health Tips */}
                <View style={styles.tipsSection}>

                    <ScrollView
                        style={styles.tipsScroll}
                        contentContainerStyle={styles.tipsContent}
                    >
                        {[
                            { id: 1, tip: "Stay hydrated - Drink at least 8 glasses daily", icon: "water", color: colors.blue1 },
                            { id: 2, tip: "Take breaks from screens every 20 minutes", icon: "eye", color: colors.blue1 },
                            { id: 3, tip: "Practice deep breathing for stress relief", icon: "medical", color: colors.blue1 },
                            { id: 4, tip: "Get 7-8 hours of sleep for optimal health", icon: "moon", color: colors.blue1 },
                        ].map((item) => (
                            <View key={item.id} style={[styles.tipCard, { borderLeftColor: item.color }]}>
                                <View style={[styles.tipIcon, { backgroundColor: colors.darkGrey }]}>
                                    <Ionicons name={item.icon} size={20} color={item.color} />
                                </View>
                                <Text style={styles.tipText}>{item.tip}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Security Badge */}
                <View style={styles.securitySection}>
                    <View style={styles.securityCard}>
                        <View style={styles.securityIcon}>
                            <Ionicons name="shield-checkmark" size={32} color={colors.success} />
                        </View>
                        <View style={styles.securityContent}>
                            <Text style={styles.securityTitle}>Your Data is Secure</Text>
                            <Text style={styles.securityDescription}>
                                All health information is encrypted and protected with industry-leading security
                            </Text>
                            <View style={styles.badges}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>HIPAA Compliant</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Helper function for time-based greeting
const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black1,
    },
    header: {
        backgroundColor: colors.black1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 100,
    },
    headerBackground: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#4FC3F7',
    },
    onlineIndicator: {
        position: 'absolute',
        right: 2,
        bottom: 2,
        width: 10,
        height: 10,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#1E293B',
    },
    profileInfo: {
        gap: 2,
    },
    greetingText: {
        color: '#94A3B8',
        fontSize: 12,
        fontFamily: 'System',
        fontWeight: '500',
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'System',
    },
    menuButton: {
        width: 32,
        height: 32,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    dropdownMenu: {
        position: 'absolute',
        right: 20,
        top: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 8,
        minWidth: 160,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    dropdownText: {
        color: '#334155',
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'System',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    welcomeCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 10,

        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 6,
        backgroundColor: colors.blue1 + '33',
        borderWidth: 2,
    },
    welcomeCardBackground: {
        padding: 24,
    },
    welcomeContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeTextContainer: {
        flex: 1,
    },
    welcomeTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
        fontFamily: 'System',
    },
    welcomeSubtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'System',
    },
    logoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: 80,
        height: 80,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginLeft: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'System',
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'System',
        textAlign: 'center',
        fontStyle: 'italic'
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    featuresSection: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        fontFamily: 'System',
    },
    sectionSubtitle: {
        color: colors.lightText,
        fontSize: 14,
        fontFamily: 'System',
    },
    featuresGrid: {
        gap: 16,
    },
    featureCard: {
        borderRadius: 16,
        borderLeftWidth: 4,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    featureContent: {
        padding: 20,
    },
    featureHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        // marginBottom: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    featureTitleContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
        fontFamily: 'System',
    },
    featureDescription: {
        color: colors.lightText,
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'System',
        marginBottom: 12,
    },
    featureFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tryNowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tryNowText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'System',
    },
    featureStats: {
        flexDirection: 'row',
        gap: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 11,
        fontWeight: '500',
        fontFamily: 'System',
    },
    quickActions: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 12,
    },
    actionButton: {
        width: (width - 40 - 16) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    actionText: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'System',
        textAlign: 'center',
    },
    tipsSection: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    seeAllText: {
        color: '#4A6FA5',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'System',
    },
    tipsScroll: {
        marginLeft: -20,
        paddingLeft: 20,
    },
    tipsContent: {
        gap: 12,
        // paddingRight: 20,
    },
    tipCard: {
        backgroundColor: colors.blue1 + '33',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        minWidth: width * 0.7,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderColor: '#E2E8F0',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        width: '100%',
    },
    tipIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipText: {
        color: colors.lightText,
        fontSize: 14,
        flex: 1,
        fontFamily: 'System',
        fontWeight: '500',
    },
    securitySection: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    securityCard: {
        backgroundColor: colors.black1,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: colors.success,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 6,
    },
    securityIcon: {
        marginRight: 16,
    },
    securityContent: {
        flex: 1,
    },
    securityTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        fontFamily: 'System',
    },
    securityDescription: {
        color: colors.lightText,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 12,
        fontFamily: 'System',
    },
    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        backgroundColor: colors.success,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.success,
    },
    badgeText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '600',
        fontFamily: 'System',
    },
});