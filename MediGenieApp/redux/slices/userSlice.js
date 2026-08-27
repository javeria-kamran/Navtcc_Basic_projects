// redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;

// console.log("API URL:", API_URL);

/* ---------------- FETCH USER ---------------- */
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      let token = state.auth.token; // try Redux first

      if (!token) {
        token = await AsyncStorage.getItem("access"); // fallback
      }

      if (!token) return thunkAPI.rejectWithValue("No token");

      const res = await axios.get(
        `${API_URL}/auth/user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------------- UPDATE USER PROFILE ---------------- */
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (updatedData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      let token = state.auth.token;

      if (!token) {
        token = await AsyncStorage.getItem("access");
      }

      if (!token) return thunkAPI.rejectWithValue("No token");

      const res = await axios.put(
        `${API_URL}/profiles/update/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return res.data; // server returns updated profile
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    pk: null,
    email: null,
    role: null,

    // Profile fields
    id: null,
    name: null,
    age: null,
    date_of_birth: null,
    image: null,
    gender: null,
    city: null,
    chronic_conditions: null,
    current_medications: null,
    known_allergies: null,
    family_medical_history: null,
    symptom_pattern: null,
    sleep_quality: null,
    diet_type: null,
    lifestyle_type: null,
    occupation: null,
    smoking: null,
    alcohol: null,
    personal_goals: ["Eat Healthy", "Stay Hydrated"],

    loading: false,
    error: null,
  },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetUser: (state) => {
      Object.keys(state).forEach((key) => {
        if (["loading", "error"].includes(key)) return;
        state[key] = null;
      });
    },
    updateUserImage: (state, action) => {
      state.image = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* -------- FETCH USER -------- */
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        const { pk, email, role, profile } = action.payload;

        state.pk = pk;
        state.email = email;
        state.role = role;

        if (profile) {
          state.id = profile.id;
          state.name = profile.name;
          state.age = profile.age;
          state.date_of_birth = profile.date_of_birth;
          state.image = profile.image;
          state.gender = profile.gender;
          state.city = profile.city;
          state.chronic_conditions = profile.chronic_conditions;
          state.current_medications = profile.current_medications;
          state.known_allergies = profile.known_allergies;
          state.family_medical_history = profile.family_medical_history;
          state.symptom_pattern = profile.symptom_pattern;
          state.sleep_quality = profile.sleep_quality;
          state.diet_type = profile.diet_type;
          state.lifestyle_type = profile.lifestyle_type;
          state.occupation = profile.occupation;
          state.smoking = profile.smoking;
          state.alcohol = profile.alcohol;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* -------- UPDATE USER -------- */
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        // merge updated fields into state
        Object.assign(state, action.payload);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateField, resetUser, updateUserImage } = userSlice.actions;
export default userSlice.reducer;
