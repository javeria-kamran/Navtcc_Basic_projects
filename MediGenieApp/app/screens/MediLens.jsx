import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  createSession,
  deleteSession,
  fetchMessages,
  fetchSessions,
  retrieveSession,
  sendMessage,
} from "../../redux/slices/mediLensSlice";
import { colors } from "../../utils/constants";

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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble,
        { opacity: fadeAnim },
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.isUser ? "white" : "#e8e8e8" },
        ]}
      >
        {item.text}
      </Text>
    </Animated.View>
  );
});

export default function MediLens() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { sessionId, messages, sessions, loading, title } = useSelector(
    (state) => state.mediLens
  );

  const [inputText, setInputText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.canceled) return;

      setIsUploading(true);
      const savedFile = {
        uri: result.assets[0].uri,
        name: result.assets[0].name || "document.pdf",
        type: "application/pdf",
      };

      const res = await dispatch(
        createSession({ file: savedFile, title: savedFile.name })
      );

      if (res.meta.requestStatus === "fulfilled") {
        setPdfUploaded(true);
        Alert.alert("✅ Ready!", `"${savedFile.name}" uploaded successfully`);
        dispatch(fetchSessions());
      } else {
        throw new Error(res.payload?.error || "Upload failed");
      }
    } catch (err) {
      Alert.alert("❌ Upload Failed", err.message || "Could not upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    dispatch(sendMessage({ sessionId, content: inputText }));
    setInputText("");
    setIsBotTyping(true);

    setTimeout(() => setIsBotTyping(false), 2500);
  };

  const handleDeleteSession = (id) => {
    Alert.alert("Delete Session", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteSession(id)),
      },
    ]);
  };

  const handleSessionSelect = useCallback((sessionId) => {
    dispatch(retrieveSession(sessionId)).then(() => {
      dispatch(fetchMessages(sessionId));
    });
    setPdfUploaded(true);
    setMenuOpen(false);
  }, [dispatch]);

  // Get visible messages for display
  const visibleMessages = messages.slice(-visibleCount);
  const canLoadMore = messages.length > visibleCount;

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

  // Add after handleSessionSelect function
  const handleNewChat = () => {
    Alert.alert("New Chat", "Start a new PDF session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "New Chat",
        onPress: () => {
          setPdfUploaded(false);
          setMenuOpen(false);
          // Clear session if needed
          // dispatch(clearSession()); // Add if you have this action
        },
      },
    ]);
  };

  const handleRefresh = async () => {
    if (!sessionId) return;

    setRefreshing(true);
    try {
      await dispatch(retrieveSession(sessionId)).unwrap();
      await dispatch(fetchMessages(sessionId)).unwrap();
      await dispatch(fetchSessions()).unwrap();
    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Ionicons name="menu-outline" color={colors.lightText} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          DocIntel AI
        </Text>

        {/* Add this headerRight section */}
        <View style={styles.headerRight}>
          {pdfUploaded && (
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
          <Text style={styles.sideMenuTitle}>Sessions</Text>

          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.sessionItem,
                    item.id === sessionId
                      ? styles.sessionActive
                      : styles.sessionInactive,
                  ]}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => handleSessionSelect(item.id)}
                  >
                    <Text style={styles.sessionText}>{item.title}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSession(item.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      color={colors.fail}
                      size={15}
                    />
                  </TouchableOpacity>
                </View>
              )}
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
            {!pdfUploaded && !isUploading && (
              <View style={styles.newChatScreen}>
                <View style={styles.newChatIconContainer}>
                  <Ionicons name="document-attach-outline" size={80} color={colors.blue1} />
                  <Text style={styles.newChatTitle}>Upload Medical PDF</Text>
                  <Text style={styles.newChatSubtitle}>
                    Upload medical documents, reports, or research papers and get instant AI-powered insights
                  </Text>
                  <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <Ionicons name="cloud-upload-outline" size={20} color="white"  />
                      {/* <Text style={styles.uploadButtonText}>Upload PDF Document</Text> */}
                    <Text style={styles.uploadSubText}>
                      Supports PDF files up to 1MB
                    </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isUploading && (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.blue1} />
                <Text style={{ color: "white", marginTop: 8 }}>
                  Analyzing your PDF...
                </Text>
              </View>
            )}

            {pdfUploaded && (
              <FlatList
                ref={flatListRef}
                data={[
                  ...visibleMessages,
                  ...(isBotTyping ? [{ id: "typing", text: "", isUser: false, typing: true }] : []),
                ]}
                keyExtractor={keyExtractor}
                renderItem={renderMessageItem}
                contentContainerStyle={{ padding: 16 }}
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
                        ⬆ Load More ({messages.length - visibleCount} more)
                      </Text>
                    </TouchableOpacity>
                  )
                }
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
              />
            )}

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={
                  pdfUploaded ? "Type your question..." : "Upload a PDF to start"
                }
                placeholderTextColor="#888"
                editable={pdfUploaded}
                style={[
                  styles.textInput,
                  { backgroundColor: pdfUploaded ? "#222" : "#555" },
                ]}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!pdfUploaded || !inputText.trim()}
                style={{
                  marginLeft: 8,
                  opacity: (pdfUploaded && inputText.trim()) ? 1 : 0.4,
                }}
              >
                <Ionicons name="send-outline" size={22} color={colors.blue1} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold", marginLeft: 12 },
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  sessionActive: { backgroundColor: colors.blue1 },
  sessionInactive: { backgroundColor: "#333" },
  sessionText: { color: "white", flex: 1 },
  deleteButton: {
    backgroundColor: "#faa",
    borderRadius: 20,
    padding: 6,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  // uploadButtonText: { textAlign: "center", color: "white", fontSize: 16, fontWeight: "600" },
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
  // Also update headerTitle to have flex: 1
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1,
  },
  newChatScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  newChatIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: colors.blue1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  uploadButtonText: {
    color: "white",
    // fontSize: 18,
    fontWeight: "600",
    textAlign: 'center',
  },
  uploadSubText: {
    color: 'white',
    fontSize: 12,
    // marginTop: 4,
    textAlign: 'center',
  },
});