import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import userReducer from './slices/userSlice';
import mediLensReducer from "./slices/mediLensSlice";
import symptomCheckerReducer from './slices/symptomCheckerSlice';
import dermIQReducer from './slices/dermIQSlice';
import aiTherapicoReducer from './slices/aiTherapicoSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    user: userReducer,
    mediLens: mediLensReducer,
    symptomChecker: symptomCheckerReducer,
    dermIQ: dermIQReducer,
    aiTherapico: aiTherapicoReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false, // turn off serializability check
  //   }),
});

export default store;
