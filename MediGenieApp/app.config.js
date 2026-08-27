import "dotenv/config";

export default {
  expo: {
    name: "MediGenie",
    slug: "MediGenieApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/logo.png", // Create a splash screen image
      resizeMode: "contain",
      backgroundColor: "#000000" // Match your app's background
    },
    scheme: "medigenie",
    entryPoint: "./app/SplashScreen.js",
    ios: {
      bundleIdentifier: "com.minahil_moiz.MediGenieApp",
      supportsTablet: true,
    },
    android: {
      package: "com.minahil_moiz.MediGenieApp",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundImage: "./assets/images/logo.png",
        monochromeImage: "./assets/images/logo.png",
        backgroundColor: "#E6F4FE",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/logo.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-font",
      "expo-web-browser"
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      API_URL: process.env.API_URL ?? "https://api.medigenie.hashkoders.com/api",
      eas: {
        projectId: "de9c0212-1135-435b-9d73-b3bdc24314f1",
      },
    },
  },
};
