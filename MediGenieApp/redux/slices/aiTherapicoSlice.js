import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;

// 🔹 Fetch Therapist Sessions List
export const fetchTherapistSessions = createAsyncThunk(
  "aiTherapico/fetchTherapistSessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const response = await axios.get(`${API_URL}/sessions/PSYCHAI/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.results || [];
    } catch (error) {
      console.log("Fetch Therapist Sessions Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to load sessions" });
    }
  }
);

// 🔹 Create Therapist Session
export const createTherapistSession = createAsyncThunk(
  "aiTherapico/createTherapistSession",
  async (title = "Therapy Session", { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const response = await axios.post(
        `${API_URL}/therapist/session/create/`,
        { title: title },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Create session response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Create Therapist Session Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to create session" });
    }
  }
);

// 🔹 Retrieve Therapist Session
export const retrieveTherapistSession = createAsyncThunk(
  "aiTherapico/retrieveTherapistSession",
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
      console.log("Retrieve Therapist Session Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to retrieve session" });
    }
  }
);

// 🔹 Send Therapist Message - SIMPLIFIED (non-streaming version)
export const sendTherapistMessage = createAsyncThunk(
  "aiTherapico/sendTherapistMessage",
  async ({ sessionId, content }, { dispatch, rejectWithValue }) => {
    let botId = null;
    
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      // Add user message immediately
      const userMessage = { 
        id: Date.now().toString(), 
        text: content, 
        isUser: true 
      };
      dispatch(addMessage(userMessage));

      // Add temporary bot message
      botId = `${Date.now()}-bot`;
      dispatch(addMessage({ 
        id: botId, 
        text: "...", 
        isUser: false, 
        streaming: false 
      }));

      console.log("Sending message payload:", {
        session: sessionId,
        content: content
      });

      // Send message using axios (simpler, non-streaming)
      const response = await axios.post(
        `${API_URL}/therapist/message/create/`,
        {
          session: sessionId,
          content: content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Message response data:", response.data);
      
      // Extract message from response
      let botReply = "";
      
      if (typeof response.data === 'string') {
        // Handle streaming string response
        const lines = response.data.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            botReply += line.substring(6).trim() + ' ';
          }
        }
        botReply = botReply.trim();
      } else if (response.data.reply) {
        // Handle JSON response with reply field
        botReply = response.data.reply;
      } else if (response.data.content) {
        // Handle JSON response with content field
        botReply = response.data.content;
      } else if (typeof response.data === 'object') {
        // Try to get any text from object
        botReply = JSON.stringify(response.data);
      } else {
        botReply = "I'm here to listen and support you.";
      }

      // Update bot message with response
      dispatch(updateMessage({ 
        id: botId, 
        text: botReply || "Thank you for sharing. How can I support you today?"
      }));

      return { success: true, reply: botReply };
    } catch (error) {
      console.log("Send Therapist Message Error:", error);
      console.log("Error details:", error.response?.data || error.message);
      
      if (botId) {
        dispatch(updateMessage({ 
          id: botId, 
          text: "I'm having trouble processing your message. Please try again." 
        }));
      }
      
      return rejectWithValue({ 
        error: error.response?.data?.message || error.message || "Failed to send message" 
      });
    }
  }
);

// 🔹 Fetch Therapist Messages - FIXED for paginated response
export const fetchTherapistMessages = createAsyncThunk(
  "aiTherapico/fetchTherapistMessages",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue("No auth token found");

      const response = await axios.get(`${API_URL}/messages/${sessionId}/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetch messages response structure:", {
        hasResults: !!response.data.results,
        isArray: Array.isArray(response.data.results),
        count: response.data.results?.length || 0
      });

      // Get messages from results array in paginated response
      const results = response.data.results || [];
      
      if (!Array.isArray(results)) {
        console.log("Results is not an array, returning empty");
        return [];
      }

      // Normalize to match UI format
      const messages = results.map((msg, index) => ({
        id: msg.id || `msg-${Date.now()}-${index}`,
        text: msg.content || '',
        isUser: msg.role === "User",
      }));

      console.log(`Fetched ${messages.length} messages`);
      return messages.reverse();
    } catch (err) {
      console.log("Fetch messages error:", err.response?.data || err.message);
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Delete Therapist Session
export const deleteTherapistSession = createAsyncThunk(
  "aiTherapico/deleteTherapistSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue("No auth token found");

      const response = await axios.delete(
        `${API_URL}/sessions/${sessionId}/delete/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return sessionId;
    } catch (err) {
      console.log("Delete session error:", err);
      return rejectWithValue(err.message);
    }
  }
);

const aiTherapicoSlice = createSlice({
  name: "aiTherapico",
  initialState: {
    sessionId: null,
    sessions: [],
    messages: [],
    loading: false,
    error: null,
    title: "Therapy Session",
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
      .addCase(fetchTherapistSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTherapistSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.reverse();
      })
      .addCase(fetchTherapistSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Session
      .addCase(createTherapistSession.fulfilled, (state, action) => {
        state.sessionId = action.payload.id;
        state.title = action.payload.title;
        state.isSessionActive = true;
      })
      .addCase(createTherapistSession.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Retrieve Session
      .addCase(retrieveTherapistSession.fulfilled, (state, action) => {
        state.sessionId = action.payload.id;
        state.title = action.payload.title;
        
        // Get messages from recent_messages if available
        if (action.payload.recent_messages && Array.isArray(action.payload.recent_messages)) {
          state.messages = action.payload.recent_messages.reverse().map((m) => ({
            id: m.id || Date.now().toString(),
            text: m.content || '',
            isUser: m.role === "User",
          }));
        } else {
          // Keep welcome message if no messages
          state.messages = [];
        }
        state.isSessionActive = true;
      })
      .addCase(retrieveTherapistSession.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Messages
      .addCase(fetchTherapistMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTherapistMessages.fulfilled, (state, action) => {
        state.loading = false;
        // Update messages if we got an array
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.messages = action.payload;
          console.log(`Updated with ${action.payload.length} messages`);
        } else {
          console.log("No messages fetched, keeping existing");
        }
      })
      .addCase(fetchTherapistMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send Message
      .addCase(sendTherapistMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendTherapistMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Message already added via dispatch in thunk
      })
      .addCase(sendTherapistMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Session
      .addCase(deleteTherapistSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(
          (s) => s.id !== action.payload
        );
        if (state.sessionId === action.payload) {
          state.sessionId = null;
          state.messages = [];
          state.isSessionActive = false;
        }
      })
      .addCase(deleteTherapistSession.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  clearSession, 
  addMessage, 
  updateMessage, 
  clearMessages, 
  setSessionActive 
} = aiTherapicoSlice.actions;
export default aiTherapicoSlice.reducer;