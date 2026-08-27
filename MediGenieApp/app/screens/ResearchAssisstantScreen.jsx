import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSession,
  createResearchSession,
  deleteResearchSession,
  fetchResearchMessages,
  fetchResearchSessions,
  retrieveResearchSession,
  sendResearchMessage,
  setSessionActive
} from '../../redux/slices/symptomCheckerSlice';
import { colors } from '../../utils/constants';

const TypingIndicator = () => {
  const dots = ["", ".", "..", "..."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % dots.length), 400);
    return () => clearInterval(interval);
  }, []);

  return <Text style={styles.typingText}>Thinking{dots[index]}</Text>;
};

const MessageBubble = React.memo(({ item }) => {
  return (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={[
        styles.messageText,
        { color: item.isUser ? 'white' : '#e8e8e8' }
      ]}>
        {item.text}
      </Text>
    </View>
  );
});

const SessionItem = React.memo(({ item, isActive, onSelect, onDelete }) => {
  // Format date for display
  const formatSessionDate = (session) => {
    if (!session.created_at) {
      // If no created_at field, try to extract from title or use current date
      const match = session.title?.match(/(\w+ \d{1,2},? \d{4}?)/);
      if (match) return match[1];
      return new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }

    const date = new Date(session.created_at);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View
      style={[
        styles.sessionItem,
        isActive ? styles.sessionActive : styles.sessionInactive,
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onSelect}
      >
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.sessionDate}>
          {formatSessionDate(item)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Ionicons
          name="trash-outline"
          color={colors.fail}
          size={15}
        />
      </TouchableOpacity>
    </View>
  );
});

export default function ResearchAssisstantScreen() {
  const dispatch = useDispatch();
  const {
    sessionId,
    messages,
    sessions,
    loading,
    isSessionActive
  } = useSelector((state) => state.symptomChecker);

  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [hasUserStartedChat, setHasUserStartedChat] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    dispatch(fetchResearchSessions());
    // Start with a fresh chat (no session created until user sends message)
    dispatch(clearSession());
  }, [dispatch]);

  // Generate session title with current date
  const generateSessionTitle = () => {
    const now = new Date();
    return `MedIntel AI - ${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  const handleCreateNewSession = async () => {
    try {
      setIsCreatingSession(true);
      const sessionTitle = generateSessionTitle();
      const res = await dispatch(createResearchSession(sessionTitle));

      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(setSessionActive(true));
        setHasUserStartedChat(true);
        return res.payload.id; // Return the new session ID
      } else {
        throw new Error(res.payload?.error || "Failed to create session");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to start MedIntel Ai session");
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    let currentSessionId = sessionId;

    // If no active session, create one first
    if (!isSessionActive || !sessionId) {
      const newSessionId = await handleCreateNewSession();
      if (!newSessionId) return; // Stop if session creation failed
      currentSessionId = newSessionId;

      // Refresh sessions list to show the new session in sidebar
      dispatch(fetchResearchSessions());
    }

    if (currentSessionId) {
      // Set flag that user has started chatting
      if (!hasUserStartedChat) {
        setHasUserStartedChat(true);
      }

      dispatch(sendResearchMessage({ sessionId: currentSessionId, content: inputText }));
      setInputText('');
      setIsBotTyping(true);

      setTimeout(() => setIsBotTyping(false), 2500);
    }
  };

  const handleSessionSelect = useCallback(async (selectedSessionId) => {
    try {
      await dispatch(retrieveResearchSession(selectedSessionId)).unwrap();
      await dispatch(fetchResearchMessages(selectedSessionId)).unwrap();
      dispatch(setSessionActive(true));
      setHasUserStartedChat(true); // User has selected a session, so hide new chat screen
      setMenuOpen(false);
    } catch (error) {
      console.log("Session load error:", error);
      // Don't show alert for normal session loading
    }
  }, [dispatch]);

  const handleDeleteSession = (sessionIdToDelete) => {
    Alert.alert("Delete Session", "Are you sure you want to delete this conversation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(deleteResearchSession(sessionIdToDelete));
          // If the deleted session was the current one, clear the chat
          if (sessionIdToDelete === sessionId) {
            dispatch(clearSession());
            setHasUserStartedChat(false);
          }
        },
      },
    ]);
  };

  const handleNewChat = () => {
    Alert.alert("New Chat", "Start a new MedIntel Ai session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "New Chat",
        onPress: () => {
          dispatch(clearSession());
          setHasUserStartedChat(false);
          setMenuOpen(false);
        },
      },
    ]);
  };

  const handleRefresh = async () => {
    if (!sessionId) return;

    setRefreshing(true);
    try {
      // Refresh current session and messages
      await dispatch(retrieveResearchSession(sessionId)).unwrap();
      await dispatch(fetchResearchMessages(sessionId)).unwrap();
      // Refresh sessions list
      await dispatch(fetchResearchSessions()).unwrap();
    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Get messages for display - remove welcome message and [DONE]
  const displayMessages = messages.map(msg => ({
    ...msg,
    text: msg.text.replace(/\[DONE\]/g, '') // Remove [DONE] from all messages
  }));

  const visibleMessages = displayMessages.slice(-visibleCount);
  const canLoadMore = displayMessages.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const renderMessageItem = useCallback(({ item }) => {
    if (item.typing) {
      return (
        <View style={[styles.messageBubble, styles.botBubble]}>
          <TypingIndicator />
        </View>
      );
    }
    return <MessageBubble item={item} />;
  }, []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Show new chat screen when no session is active and user hasn't started chatting
  const showNewChatScreen = !isSessionActive && !hasUserStartedChat;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuOpen(!menuOpen)}>
          <Ionicons name="menu-outline" color={colors.lightText} size={22} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>MedIntel Ai</Text>

        <View style={styles.headerRight}>
          {isSessionActive && (
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <Ionicons name="refresh-outline" color={colors.lightText} size={22} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
            <Ionicons name="add-outline" color={colors.lightText} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Side Menu */}
      {menuOpen && (
        <View style={styles.sideMenu}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setMenuOpen(false)}
          >
            <Ionicons name="close" color={colors.lightText} size={22} />
          </TouchableOpacity>
          <Text style={styles.sideMenuTitle}>Conversations</Text>

          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SessionItem
                  item={item}
                  isActive={item.id === sessionId}
                  onSelect={() => handleSessionSelect(item.id)}
                  onDelete={() => handleDeleteSession(item.id)}
                />
              )}
              ListEmptyComponent={
                <Text style={styles.noSessionsText}>
                  No conversations yet
                </Text>
              }
            />
          )}
        </View>
      )}

      {/* Chat Section */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* New Chat Screen */}
            {showNewChatScreen && (
              <View style={styles.newChatScreen}>
                <View style={styles.newChatIconContainer}>
                  <Ionicons name="chatbubble-ellipses-outline" size={80} color={colors.blue1} />
                  <Text style={styles.newChatTitle}>New Chat</Text>
                  <Text style={styles.newChatSubtitle}>
                    Start a new conversation with your MedIntel AI
                  </Text>
                </View>
              </View>
            )}

            {/* Chat Messages - Only show when user has started chatting */}
            {!showNewChatScreen && (
              <FlatList
                ref={flatListRef}
                data={[
                  ...visibleMessages,
                  ...(isBotTyping ? [{ id: "typing", text: "", isUser: false, typing: true }] : []),
                ]}
                keyExtractor={keyExtractor}
                renderItem={renderMessageItem}
                contentContainerStyle={[
                  styles.chatContainer,
                  displayMessages.length === 0 && styles.emptyChatContainer
                ]}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                ListHeaderComponent={
                  canLoadMore && (
                    <TouchableOpacity
                      onPress={handleLoadMore}
                      style={styles.loadMoreButton}
                    >
                      <Text style={styles.loadMoreText}>
                        ⬆ Load More ({displayMessages.length - visibleCount} more)
                      </Text>
                    </TouchableOpacity>
                  )
                }
                ListEmptyComponent={
                  !isBotTyping && (
                    <View style={styles.emptyChat}>
                      <Ionicons name="chatbubble-outline" size={50} color={colors.lightText} />
                      <Text style={styles.emptyChatText}>
                        Start a conversation with your assistant
                      </Text>
                    </View>
                  )
                }
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
              />
            )}

            {/* Input Area - Always enabled */}
            <View style={styles.inputContainer}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={
                  showNewChatScreen ? "Type your message to start chatting..." : "Describe your symptoms..."
                }
                placeholderTextColor="#888"
                style={styles.textInput}
                multiline
                maxLength={500}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!inputText.trim() || loading || isCreatingSession}
                style={{
                  marginLeft: 8,
                  opacity: (inputText.trim() && !loading && !isCreatingSession) ? 1 : 0.4,
                }}
              >
                {(loading || isCreatingSession || refreshing) ? (
                  <ActivityIndicator size="small" color={colors.blue1} />
                ) : (
                  <Ionicons name="send-outline" size={22} color={colors.blue1} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {(loading || isCreatingSession || refreshing) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.blue1} />
          <Text style={styles.loadingText}>
            {isCreatingSession ? 'Starting new chat...' : refreshing ? 'Refreshing...' : 'Processing...'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },
  menuButton: {
    backgroundColor: colors.darkGrey,
    borderRadius: 25,
    padding: 8,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: colors.darkGrey,
    borderRadius: 25,
    padding: 8,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  newChatButton: {
    backgroundColor: colors.darkGrey,
    borderRadius: 25,
    padding: 8,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#181818",
    padding: 16,
    zIndex: 50,
  },
  closeButton: {
    backgroundColor: "#333",
    borderRadius: 25,
    padding: 8,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  sideMenuTitle: { color: "white", fontSize: 20, fontWeight: "bold", marginVertical: 16 },
  sessionItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sessionActive: { backgroundColor: colors.blue1 },
  sessionInactive: { backgroundColor: "#333" },
  sessionTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  sessionDate: {
    color: colors.lightGrey,
    fontSize: 12,
    opacity: 0.8,
  },
  noSessionsText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#faa",
    borderRadius: 20,
    padding: 6,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    right: 12,
    top: 12,
  },
  // New Chat Screen Styles
  newChatScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  newChatIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  newChatSubtitle: {
    color: colors.lightText,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyChatContainer: {
    justifyContent: 'center',
  },
  emptyChat: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyChatText: {
    color: colors.lightText,
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.blue1,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#2a2a2a",
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  typingText: { color: "#aaa", fontSize: 14, fontStyle: "italic" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#222",
    backgroundColor: "#171717",
  },
  textInput: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "white",
    backgroundColor: "#222",
  },
  loadMoreButton: {
    alignSelf: "center",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#333",
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
  },
  loadMoreText: { color: colors.blue1, fontSize: 14, fontWeight: "600" },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
});