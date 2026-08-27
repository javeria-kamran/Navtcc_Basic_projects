// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, verifyOtp, loginUser, logoutUser } from "../thunks/authThunks";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadToken = createAsyncThunk("auth/loadToken", async () => {
  try {
    const access = await AsyncStorage.getItem("access");
    const refresh = await AsyncStorage.getItem("refresh");
    const user = await AsyncStorage.getItem("user");

    // console.log("🔍 Checking AsyncStorage:", {
    //   hasAccess: !!access,
    //   hasRefresh: !!refresh,
    //   hasUser: !!user
    // });

    if (access && refresh && user) {
      const parsedUser = JSON.parse(user);

      // 🔴 FIX: Only check for email, not id
      if (!parsedUser.email) {
        console.log('❌ User has no email field');
        return null;
      }

      // ✅ Accept user even without id
      return { access, refresh, user: parsedUser };
    }

    console.log("❌ No tokens found in AsyncStorage");
    return null;
  } catch (err) {
    console.log("Failed to load token:", err);
    return null;
  }
});

const initialState = {
  isLoggedIn: false,
  isRegistered: false,
  user: null,
  access: null,
  refresh: null,
  loginMethod: "email",
  loading: false,
  error: null,
  registrationMessage: null,
  otpVerified: false,
  otpMessage: null,
  appLoaded: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetRegistration: (state) => {
      state.isRegistered = false;
      state.registrationMessage = null;
    },
    resetOtp: (state) => {
      state.otpVerified = false;
      state.otpMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔴 CRITICAL: Add these three handlers for loadToken
      // src/redux/slices/authSlice.js (partial update)
      // In your loadToken handlers:
      .addCase(loadToken.pending, (state) => {
        state.loading = true;
        state.appLoaded = false;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        state.loading = false;
        state.appLoaded = true; // ✅ This is IMPORTANT

        if (action.payload) {
          state.access = action.payload.access;
          state.refresh = action.payload.refresh;
          state.user = action.payload.user;
          state.isLoggedIn = true;
        } else {
          state.isLoggedIn = false;
          state.user = null;
          state.access = null;
          state.refresh = null;
        }
      })
      .addCase(loadToken.rejected, (state, action) => {
        state.loading = false;
        state.appLoaded = true; // ✅ Even on error, mark as loaded
        state.isLoggedIn = false;
        state.error = action.error.message;
      })
      // ... rest of your handlers remain the same
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isRegistered = true;
        state.registrationMessage = action.payload?.message || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { error: { message: "Registration failed" } };
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.user = action.payload.user;
        state.appLoaded = true; // ✅ Also set appLoaded on login
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload || { error: { message: "Login failed" } };
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.otpMessage = "OTP Verified Successfully";
        state.isLoggedIn = true;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.user = action.payload.user;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.otpVerified = false;
        state.error = action.payload || { error: { message: "OTP verification failed" } };
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.access = null;
        state.refresh = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { error: { message: "Logout failed" } };
      });
  },
});

export const { resetRegistration, resetOtp } = authSlice.actions;
export default authSlice.reducer;