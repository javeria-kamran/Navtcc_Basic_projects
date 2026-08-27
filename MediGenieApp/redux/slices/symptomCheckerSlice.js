import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;

// 🔹 Fetch Research Sessions List
export const fetchResearchSessions = createAsyncThunk(
  "symptomChecker/fetchResearchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const response = await axios.get(`${API_URL}/sessions/research/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.results;
    } catch (error) {
      console.log("Fetch Research Sessions Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to load sessions" });
    }
  }
);

// 🔹 Create Research Session
export const createResearchSession = createAsyncThunk(
  "symptomChecker/createResearchSession",
  async (title = "Symptom Checker Session", { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const response = await axios.post(
        `${API_URL}/research/session/create/`,
        {
          title: title,
          embedding_model: "sentence-transformers/all-MiniLM-L6-v2",
          session_type: "RESEARCH"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Create Research Session Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to create session" });
    }
  }
);

// 🔹 Retrieve Research Session
export const retrieveResearchSession = createAsyncThunk(
  "symptomChecker/retrieveResearchSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const response = await axios.get(
        `${API_URL}/sessions/${sessionId}/retrieve/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Retrieve Research Session Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to retrieve session" });
    }
  }
);

// 🔹 Send Research Message
export const sendResearchMessage = createAsyncThunk(
  "symptomChecker/sendResearchMessage",
  async ({ sessionId, content }, { dispatch, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      // Add user message immediately
      const userMessage = { id: Date.now().toString(), text: content, isUser: true };
      dispatch(addMessage(userMessage));

      // Add temporary bot message
      const botId = `${Date.now()}-bot`;
      dispatch(addMessage({ id: botId, text: "...", isUser: false, streaming: false }));

      const response = await fetch(`${API_URL}/research/message/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session: sessionId, content }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Message failed");
      }

      let botReply;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        botReply = (await response.json()).reply || "No reply found";
      } else {
        botReply = await response.text();
      }

      const cleanedBotReply = botReply
        .split("\n")
        .map((line) => line.replace(/^data:\s?/, "").trim())
        .filter((line) => line.length > 0)
        .join(" ");

      dispatch(updateMessage({ id: botId, text: cleanedBotReply }));

      return { success: true };
    } catch (error) {
      console.log("Send Research Message Error:", error.message);
      return rejectWithValue({ error: error.message });
    }
  }
);

// 🔹 Fetch Research Messages
export const fetchResearchMessages = createAsyncThunk(
  "symptomChecker/fetchResearchMessages",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue("No auth token found");

      const response = await fetch(`${API_URL}/messages/${sessionId}/list/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to fetch messages");
      }

      const data = await response.json();

      // Normalize to match UI format
      return data.map((msg) => ({
        id: msg.id,
        text: msg.content,
        isUser: msg.role === "User",
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Delete Research Session
export const deleteResearchSession = createAsyncThunk(
  "symptomChecker/deleteResearchSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue("No auth token found");

      const response = await fetch(`${API_URL}/sessions/${sessionId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to delete session");
      }

      return sessionId;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

const symptomCheckerSlice = createSlice({
  name: "symptomChecker",
  initialState: {
    sessionId: null,
    sessions: [],
    messages: [],
    loading: false,
    error: null,
    title: "Symptom Checker",
    isSessionActive: false,
  },
  reducers: {
    clearSession: (state) => {
      state.sessionId = null;
      state.error = null;
      state.messages = [];
      state.isSessionActive = false;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const { id, text } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) {
        msg.text = text;
        msg.streaming = false;
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setSessionActive: (state, action) => {
      state.isSessionActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sessions
      .addCase(fetchResearchSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResearchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.reverse();
      })
      .addCase(fetchResearchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Session
      .addCase(createResearchSession.fulfilled, (state, action) => {
        state.sessionId = action.payload.id;
        state.title = action.payload.title;
        state.isSessionActive = true;
      })
      // Retrieve Session
      .addCase(retrieveResearchSession.fulfilled, (state, action) => {
        state.sessionId = action.payload.id;
        state.title = action.payload.title;
        state.messages =
          action.payload.recent_messages?.reverse().map((m) => ({
            id: m.id,
            text: m.content,
            isUser: m.role === "User",
          })) || [];
        state.isSessionActive = true;
      })
      // Fetch Messages
      .addCase(fetchResearchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResearchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.length > 0 ? action.payload : [];
      })
      .addCase(fetchResearchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Session
      .addCase(deleteResearchSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(
          (s) => s.id !== action.payload
        );
        if (state.sessionId === action.payload) {
          state.sessionId = null;
          state.messages = [];
          state.isSessionActive = false;
        }
      });
  },
});

export const { 
  clearSession, 
  addMessage, 
  updateMessage, 
  clearMessages, 
  setSessionActive 
} = symptomCheckerSlice.actions;
export default symptomCheckerSlice.reducer;