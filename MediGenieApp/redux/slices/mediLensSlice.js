import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;

console.log("API URL:", API_URL);

// 🔹 Fetch Session List
export const fetchSessions = createAsyncThunk(
  "mediLens/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const response = await axios.get(`${API_URL}/sessions/rag/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.results; // Extract the results array
    } catch (error) {
      console.log("Fetch Sessions Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Failed to load sessions" });
    }
  }
);

// 🔹 Retrieve Session (on click from list)
export const retrieveSession = createAsyncThunk(
  "mediLens/retrieveSession",
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

// 🔹 Create Session
export const createSession = createAsyncThunk(
  "mediLens/createSession",
  async ({ file, title }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: "application/pdf",
      });
      formData.append("title", title);

      const response = await axios.post(`${API_URL}/rag/session/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Create Session Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: "Upload failed" });
    }
  }
);

// 🔹 Send Message
export const sendMessage = createAsyncThunk(
  "mediLens/sendMessage",
  async ({ sessionId, content }, { dispatch, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const userMessage = { id: Date.now().toString(), text: content, isUser: true };
      dispatch(addMessage(userMessage));

      const botId = `${Date.now()}-bot`;
      dispatch(addMessage({ id: botId, text: "...", isUser: false, streaming: false }));

      const response = await fetch(`${API_URL}/rag/message/create/`, {
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
      console.log("Send Message Error:", error.message);
      return rejectWithValue({ error: error.message });
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "mediLens/fetchMessages",
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

export const updateSessionTitle = createAsyncThunk(
  "mediLens/updateSessionTitle",
  async ({ sessionId, title }, { getState, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return rejectWithValue({ error: "No auth token found" });

      const state = getState().mediLens;
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

export const deleteSession = createAsyncThunk(
  "mediLens/deleteSession",
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

const mediLensSlice = createSlice({
  name: "mediLens",
  initialState: {
    sessionId: null,
    sessions: [],
    loading: false,
    error: null,
    messages: [],
    pdfFile: null,
    title: null,
  },
  reducers: {
    clearSession: (state) => {
      state.sessionId = null;
      state.error = null;
      state.messages = [];
      state.pdfFile = null;
      state.title = null;
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
        state.sessions = action.payload.reverse(); // Now action.payload is the results array
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessionId = action.payload.id;
        state.title = action.payload.title;
      })
      .addCase(retrieveSession.fulfilled, (state, action) => {
        state.sessionId = action.payload.id;
        state.title = action.payload.title;
        state.messages =
          action.payload.recent_messages?.reverse().map((m) => ({
            id: m.id,
            text: m.content,
            isUser: m.role === "User",
          })) || [];
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
        }
      });
  },
});

export const { clearSession, addMessage, updateMessage, clearMessages, startEditingTitle, setTempTitle, stopEditingTitle } = mediLensSlice.actions;
export default mediLensSlice.reducer;