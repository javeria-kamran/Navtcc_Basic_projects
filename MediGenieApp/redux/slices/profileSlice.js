// src/redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { requestCameraPermission } from '../../utils/Permissions';

const defaultImage = require('../../assets/images/dummy-profile.png');

// Async thunk to launch camera
export const captureImageFromCamera = createAsyncThunk(
  'profile/captureImageFromCamera',
  async (_, { rejectWithValue }) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return rejectWithValue('Camera permission denied');

    return new Promise((resolve, reject) => {
      launchCamera({ mediaType: 'photo', cameraType: 'front' }, (response) => {
        if (response.didCancel || response.errorCode) {
          reject(rejectWithValue('Camera cancelled or failed'));
        } else {
          resolve(response.assets[0].uri);
        }
      });
    });
  }
);

// Async thunk to launch gallery
export const pickImageFromGallery = createAsyncThunk(
  'profile/pickImageFromGallery',
  async (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel || response.errorCode) {
          reject(rejectWithValue('Gallery cancelled or failed'));
        } else {
          resolve(response.assets[0].uri);
        }
      });
    });
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileImage: defaultImage,
    error: null,
  },
  reducers: {
    removeProfileImage: (state) => {
      state.profileImage = defaultImage;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(captureImageFromCamera.fulfilled, (state, action) => {
        state.profileImage = { uri: action.payload };
        state.error = null;
      })
      .addCase(pickImageFromGallery.fulfilled, (state, action) => {
        state.profileImage = { uri: action.payload };
        state.error = null;
      })
      .addCase(captureImageFromCamera.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(pickImageFromGallery.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { removeProfileImage } = profileSlice.actions;
export default profileSlice.reducer;
