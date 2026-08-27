// src/redux/thunks/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const { API_URL } = Constants.expoConfig.extra;

// 🔹 Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/registration/`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      // no need to dispatch(register(...)) — slice handles it
      return response.data;
    } catch (error) {
      const payload =
        error.response?.data || { error: { message: "Network Error" } };
      return rejectWithValue(payload);
    }
  }
);

// 🔹 Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/log-in/`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access, refresh, user } = response.data;

      // 🔴 VERIFY the data structure
      // console.log('📦 Storing auth data:', {
      //   access: access ? `Token (${access.length} chars)` : 'MISSING',
      //   refresh: refresh ? `Token (${refresh.length} chars)` : 'MISSING',
      //   user: user ? `User ID: ${user.id}, Email: ${user.email}` : 'MISSING'
      // });

      if (!access || !refresh || !user) {
        throw new Error('Incomplete auth data from server');
      }

      await AsyncStorage.multiSet([
        ["access", access],
        ["refresh", refresh],
        ["user", JSON.stringify(user)],
      ]);

      // Verify storage worked
      const storedAccess = await AsyncStorage.getItem('access');
      console.log('✅ Stored access token:', storedAccess ? 'Success' : 'Failed');

      return { access, refresh, user };
    } catch (error) {
      console.log("Login Error:", error.response?.data || error.message);
      const payload =
        error.response?.data || { error: { message: "Network Error" } };
      return rejectWithValue(payload);
    }
  }
);

// 🔹 Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/verify-code/`,
        {
          email,
          verification_code: code,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      await AsyncStorage.multiSet([
        ["access", response.data.access],
        ["refresh", response.data.refresh],
        ["user", JSON.stringify(response.data.user)],
      ]);

      return response.data;
    } catch (error) {
      console.log("OTP Verify Error:", error.response?.data || error.message);
      const payload =
        error.response?.data || { error: { message: "Network Error" } };
      return rejectWithValue(payload);
    }
  }
);

// 🔹 Logout User
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const refresh = await AsyncStorage.getItem("refresh");
      if (!refresh)
        return rejectWithValue({ error: { message: "No refresh token found" } });

      await axios.post(
        `${API_URL}/auth/logout/`,
        { refresh },
        { headers: { "Content-Type": "application/json" } }
      );

      await AsyncStorage.multiRemove(["access", "refresh", "user"]);
      return true;
    } catch (error) {
      console.log("Logout Error:", error.response?.data || error.message);
      const payload =
        error.response?.data || { error: { message: "Network Error" } };
      return rejectWithValue(payload);
    }
  }
);
