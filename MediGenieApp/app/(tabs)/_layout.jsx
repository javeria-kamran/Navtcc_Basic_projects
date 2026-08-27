import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/constants";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.blue1,
        tabBarInactiveTintColor: colors.lightText, // <- inactive is lightText
        tabBarStyle: {
          padding: 10,
          // height: 80,
          backgroundColor: colors.darkGrey,
          borderColor: "white",
        },
        tabBarLabelStyle: { paddingBottom: 6, fontSize: 10 },
      })}
    />
  );
}
