import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;

// 🔹 Fetch Session List
export const fetchSessions = createAsyncThunk(
  "dermIQ/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const response = await axios.get(`${API_URL}/sessions/dermai/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.results;
    } catch (error) {
      console.log("Fetch Sessions Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to load sessions" });
    }
  }
);

// 🔹 Retrieve Session
export const retrieveSession = createAsyncThunk(
  "dermIQ/retrieveSession",
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
      console.log("Retrieve Session Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to retrieve session" });
    }
  }
);

// 🔹 Create Session - FIXED with correct MIME type
export const createSession = createAsyncThunk(
  "dermIQ/createSession",
  async ({ image, title }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      if (!image || !image.uri) {
        return rejectWithValue({ error: "Image is required for session creation" });
      }

      console.log("Creating session with image:", {
        uri: image.uri,
        name: image.name,
        type: image.type
      });

      // Create FormData
      const formData = new FormData();

      // Determine correct MIME type
      let mimeType = 'image/jpeg'; // default
      if (image.type) {
        mimeType = image.type;
      } else {
        const uriParts = image.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1]?.toLowerCase();
        if (fileExtension === 'png') mimeType = 'image/png';
        else if (fileExtension === 'gif') mimeType = 'image/gif';
        else if (fileExtension === 'bmp') mimeType = 'image/bmp';
      }

      // Create file object with correct MIME type
      const fileObject = {
        uri: image.uri,
        name: image.name || `skin_${Date.now()}.jpg`,
        type: mimeType,
      };

      formData.append("file", fileObject);
      formData.append("title", title || `Skin Analysis ${new Date().toLocaleDateString()}`);

      const response = await axios.post(`${API_URL}/derm/session/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 60000, // 60 second timeout for image upload
      });

      console.log("Session created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.log("Create Session Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Upload failed" });
    }
  }
);

// 🔹 Send Message - FIXED for streaming response
export const sendMessage = createAsyncThunk(
  "dermIQ/sendMessage",
  async ({ sessionId, content }, { dispatch, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      // Add user message to UI immediately
      const userMessageId = Date.now().toString();
      const userMessage = {
        id: userMessageId,
        text: content,
        isUser: true,
      };
      dispatch(addMessage(userMessage));

      // Add temporary bot message
      const botId = `${Date.now()}-bot`;
      dispatch(addMessage({
        id: botId,
        text: "",
        isUser: false,
        streaming: true
      }));

      console.log("Sending message to API:", {
        session: sessionId,
        content: content
      });

      // Use fetch for better streaming support
      const response = await fetch(`${API_URL}/derm/message/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: sessionId,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read the response as text (streaming response)
      const responseText = await response.text();
      console.log("Raw response:", responseText.substring(0, 200) + "...");

      // Parse streaming response
      let fullResponse = "";
      const lines = responseText.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          const contentPart = line.substring(6).trim();
          if (contentPart) {
            fullResponse += contentPart + " ";
            
            // Update message incrementally for streaming effect
            dispatch(updateMessage({
              id: botId,
              text: fullResponse.trim(),
              streaming: true
            }));
          }
        }
      }

      // Final update when complete
      const finalText = fullResponse.trim() || "Analysis complete.";
      dispatch(updateMessage({
        id: botId,
        text: finalText,
        streaming: false
      }));

      return { content: finalText };

    } catch (error) {
      console.log("Send Message Error:", error.message);

      // Update bot message with error
      dispatch(updateMessage({
        id: botId,
        text: "Sorry, I couldn't process your message. Please try again.",
        streaming: false
      }));

      return rejectWithValue({
        error: error.message || "Failed to send message"
      });
    }
  }
);

// 🔹 Fetch Messages
export const fetchMessages = createAsyncThunk(
  "dermIQ/fetchMessages",
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
        image: msg.image || null,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Update Session Title
export const updateSessionTitle = createAsyncThunk(
  "dermIQ/updateSessionTitle",
  async ({ sessionId, title }, { getState, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const state = getState().dermIQ;
      const session = state.sessions.find(s => s.id === sessionId);
      if (!session) return rejectWithValue({ error: "Session not found" });

      const formData = new FormData();
      formData.append("title", title);

      const response = await axios.put(
        `${API_URL}/sessions/${sessionId}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Update Session Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to update session" });
    }
  }
);

// 🔹 Delete Session
export const deleteSession = createAsyncThunk(
  "dermIQ/deleteSession",
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

const dermIQSlice = createSlice({
  name: "dermIQ",
  initialState: {
    sessionId: null,
    sessions: [],
    loading: false,
    error: null,
    messages: [],
    imageFile: null,
    title: null,
  },
  reducers: {
    clearSession: (state) => {
      state.sessionId = null;
      state.error = null;
      state.messages = [];
      state.imageFile = null;
      state.title = null;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const { id, text, streaming } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) {
        msg.text = text;
        if (streaming !== undefined) {
          msg.streaming = streaming;
        }
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setImageFile: (state, action) => {
      state.imageFile = action.payload;
    },
    clearImageFile: (state) => {
      state.imageFile = null;
    },
    startEditingTitle: (state, action) => {
      const session = state.sessions.find(s => s.id === action.payload.id);
      if (session) {
        session.editing = true;
        session.tempTitle = session.title;
      }
    },
    setTempTitle: (state, action) => {
      const session = state.sessions.find(s => s.id === action.payload.id);
      if (session) {
        session.tempTitle = action.payload.title;
      }
    },
    stopEditingTitle: (state, action) => {
      const session = state.sessions.find(s => s.id === action.payload.id);
      if (session) {
        session.editing = false;
        session.tempTitle = undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.reverse();
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.id;
        state.title = action.payload.title;
        state.imageFile = null;
        // Add initial bot message
        state.messages = [{
          id: Date.now().toString(),
          text: "I've analyzed your skin image. Ask me anything about it!",
          isUser: false,
          streaming: false
        }];
      })
      .addCase(createSession.rejected, (state) => {
        state.loading = false;
        state.imageFile = null;
      })
      .addCase(retrieveSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(retrieveSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.id;
        state.title = action.payload.title;
        state.messages =
          action.payload.recent_messages?.reverse().map((m) => ({
            id: m.id,
            text: m.content,
            isUser: m.role === "User",
            image: m.image || null,
          })) || [];
      })
      .addCase(retrieveSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSessionTitle.fulfilled, (state, action) => {
        state.sessions = state.sessions.map((s) =>
          s.id === action.payload.id
            ? { ...s, title: action.payload.title, editing: false, tempTitle: undefined }
            : s
        );
        if (state.sessionId === action.payload.id) {
          state.title = action.payload.title;
        }
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(
          (s) => s.id !== action.payload
        );
        if (state.sessionId === action.payload) {
          state.sessionId = null;
          state.messages = [];
          state.title = "";
          state.imageFile = null;
        }
      });
  },
});

export const {
  clearSession,
  addMessage,
  updateMessage,
  clearMessages,
  setImageFile,
  clearImageFile,
  startEditingTitle,
  setTempTitle,
  stopEditingTitle
} = dermIQSlice.actions;

export default dermIQSlice.reducer;