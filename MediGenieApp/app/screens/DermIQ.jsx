import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSessions,
  createSession,
  sendMessage,
  retrieveSession,
  deleteSession,
  clearSession,
  addMessage,
  updateMessage,
} from '../../redux/slices/dermIQSlice';
import { colors } from '../../utils/constants';

const TypingIndicator = () => {
  const dots = ["", ".", "..", "..."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % dots.length), 400);
    return () => clearInterval(interval);
  }, []);

  return <Text style={styles.typingText}>Analyzing{dots[index]}</Text>;
};

const MessageBubble = React.memo(({ item }) => {
  // Show typing indicator for streaming messages
  if (item.streaming && (!item.text || item.text.length < 10)) {
    return (
      <View style={[styles.messageBubble, styles.botBubble]}>
        <TypingIndicator />
      </View>
    );
  }

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
  const formatSessionDate = (session) => {
    if (!session.created_at) {
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

const ImageSourceModal = ({
  visible,
  onClose,
  onSelectGallery,
  onSelectCamera,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Select Image Source
              </Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  onSelectGallery();
                  onClose();
                }}
              >
                <Ionicons name="images-outline" size={30} color={colors.blue1} />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <View style={styles.modalDivider} />

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  onSelectCamera();
                  onClose();
                }}
              >
                <Ionicons name="camera-outline" size={30} color={colors.blue1} />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={onClose}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function DermIQ() {
  const dispatch = useDispatch();
  const {
    sessionId,
    sessions,
    messages,
    loading,
    error,
  } = useSelector(state => state.dermIQ);

  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const flatListRef = useRef(null);

  // Fetch sessions on component mount and when menu opens
  useEffect(() => {
    if (menuOpen) {
      dispatch(fetchSessions());
    }
  }, [menuOpen, dispatch]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Error', typeof error === 'object' ? error.error || error.message : error);
    }
  }, [error]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleImageSourceSelect = (source) => {
    setSourceModalVisible(false);
    if (source === 'gallery') {
      pickImageFromGallery();
    } else if (source === 'camera') {
      takePhoto();
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        setSelectedImage({
          uri: image.uri,
          name: image.fileName || `skin_${Date.now()}.jpg`,
          type: image.mimeType || 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        setSelectedImage({
          uri: image.uri,
          name: `skin_${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  const handleCreateSession = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select an image first.');
      return;
    }

    try {
      setIsUploading(true);

      // Generate session title
      const now = new Date();
      const sessionTitle = `Skin Analysis - ${now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;

      console.log("Starting session creation with:", {
        title: sessionTitle,
        image: selectedImage
      });

      // Create session with image
      const result = await dispatch(createSession({
        title: sessionTitle,
        image: selectedImage
      })).unwrap();

      if (result) {
        console.log("Session created successfully:", result);
        Alert.alert('✅ Success!', 'Skin image uploaded and analysis started');
        dispatch(fetchSessions()); // Refresh sessions list
        setSelectedImage(null);
      }

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('❌ Upload Failed', error.error || error.message || 'Could not upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !sessionId) return;

    try {
      setIsBotTyping(true);
      const messageContent = inputText.trim();
      setInputText('');

      // Send message
      await dispatch(sendMessage({
        sessionId,
        content: messageContent,
      })).unwrap();

    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('Error', error.error || error.message || 'Failed to send message');
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleDeleteSession = (id) => {
    Alert.alert("Delete Session", "Are you sure you want to delete this analysis session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteSession(id)).unwrap();
            dispatch(fetchSessions()); // Refresh list
          } catch (error) {
            Alert.alert('Error', error || 'Failed to delete session');
          }
        },
      },
    ]);
  };

  const handleSessionSelect = async (selectedSessionId) => {
    try {
      // Clear current session
      dispatch(clearSession());

      // Retrieve selected session
      await dispatch(retrieveSession(selectedSessionId)).unwrap();

      setMenuOpen(false);

    } catch (error) {
      console.error('Error selecting session:', error);
      Alert.alert('Error', error.error || error.message || 'Failed to load session');
    }
  };

  const handleNewChat = () => {
    Alert.alert("New Analysis", "Start a new skin analysis session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "New Session",
        onPress: () => {
          dispatch(clearSession());
          setMenuOpen(false);
          setSelectedImage(null);
        },
      },
    ]);
  };

  const handleRefresh = async () => {
    if (!sessionId) return;

    setRefreshing(true);
    try {
      await dispatch(retrieveSession(sessionId)).unwrap();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const openImagePicker = () => {
    setSourceModalVisible(true);
  };

  // Get visible messages for display
  const visibleMessages = messages.slice(-visibleCount);
  const canLoadMore = messages.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const renderMessageItem = useCallback(({ item }) => {
    return <MessageBubble item={item} />;
  }, []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const showNewChatScreen = !sessionId && !isUploading;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuOpen(!menuOpen)}>
          <Ionicons name="menu-outline" color={colors.lightText} size={22} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Derm AI</Text>

        <View style={styles.headerRight}>
          {sessionId && (
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
          <Text style={styles.sideMenuTitle}>Analysis Sessions</Text>

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
                  No analysis sessions yet
                </Text>
              }
            />
          )}
        </View>
      )}

      {/* Image Source Modal */}
      <ImageSourceModal
        visible={sourceModalVisible}
        onClose={() => setSourceModalVisible(false)}
        onSelectGallery={() => handleImageSourceSelect('gallery')}
        onSelectCamera={() => handleImageSourceSelect('camera')}
      />

      {/* Chat Section */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* New Chat/Upload Screen */}
            {showNewChatScreen && (
              <View style={styles.newChatScreen}>
                <View style={styles.newChatIconContainer}>
                  <Ionicons name="camera-outline" size={80} color={colors.blue1} />
                  <Text style={styles.newChatTitle}>Skin Analysis</Text>
                  <Text style={styles.newChatSubtitle}>
                    Upload a skin image for AI-powered dermatological analysis and personalized recommendations
                  </Text>

                  <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.blue1} />
                      <Text style={styles.featureText}>AI-powered skin analysis</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.blue1} />
                      <Text style={styles.featureText}>Personalized skincare recommendations</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.blue1} />
                      <Text style={styles.featureText}>Track skin changes over time</Text>
                    </View>
                  </View>

                  {selectedImage ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                      <View style={styles.imageInfo}>
                        <Text style={styles.imageName} numberOfLines={1}>
                          {selectedImage.name}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => setSelectedImage(null)}
                        >
                          <Ionicons name="close-circle" size={24} color={colors.fail} />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleCreateSession}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <>
                            <Ionicons name="cloud-upload-outline" size={24} color="white" style={styles.uploadIcon} />
                            <Text style={styles.uploadButtonText}>Analyze Skin Image</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.selectImageButton}
                      onPress={openImagePicker}
                    >
                      <Ionicons name="camera" size={24} color={colors.blue1} style={styles.selectImageIcon} />
                      <Text style={styles.selectImageText}>Select Skin Image</Text>
                      <Text style={styles.selectImageSubText}>
                        Choose from gallery or take a photo
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Uploading Indicator */}
            {isUploading && (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.blue1} />
                <Text style={styles.uploadStatusText}>
                  Analyzing your skin image...
                </Text>
              </View>
            )}

            {/* Chat Screen */}
            {sessionId && (
              <FlatList
                ref={flatListRef}
                data={visibleMessages}
                keyExtractor={keyExtractor}
                renderItem={renderMessageItem}
                contentContainerStyle={styles.chatContainer}
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
                ListEmptyComponent={
                  !isBotTyping && (
                    <View style={styles.emptyChat}>
                      <Ionicons name="chatbubble-outline" size={50} color={colors.lightText} />
                      <Text style={styles.emptyChatText}>
                        Start discussing your skin analysis
                      </Text>
                    </View>
                  )
                }
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
              />
            )}

            {/* Input Area - Only show when session is active */}
            {sessionId && (
              <View style={styles.inputContainer}>
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ask about your skin analysis..."
                  placeholderTextColor="#888"
                  style={styles.textInput}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                  multiline
                  maxLength={500}
                  editable={!isBotTyping}
                />

                <TouchableOpacity
                  onPress={handleSendMessage}
                  disabled={!inputText.trim() || isBotTyping}
                  style={[
                    styles.sendButton,
                    { opacity: (inputText.trim() && !isBotTyping) ? 1 : 0.4 },
                  ]}
                >
                  {isBotTyping ? (
                    <ActivityIndicator size="small" color={colors.blue1} />
                  ) : (
                    <Ionicons name="send-outline" size={22} color={colors.blue1} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {(loading || isUploading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.blue1} />
          <Text style={styles.loadingText}>
            {isUploading ? 'Analyzing image...' : 'Processing...'}
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
  sideMenuTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16
  },
  sessionItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
  deleteButton: {
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 6,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  noSessionsText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.black1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  modalOptionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  modalCancelButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  featureText: {
    color: colors.lightText,
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  // Selected Image Styles
  imagePreviewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  imageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  imageName: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  removeImageButton: {
    marginLeft: 10,
  },
  // Button Styles
  selectImageButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  selectImageIcon: {
    marginBottom: 12,
  },
  selectImageText: {
    color: colors.blue1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: 'center',
  },
  selectImageSubText: {
    color: colors.lightText,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: colors.blue1,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadStatusText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
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
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  typingText: {
    color: "#aaa",
    fontSize: 14,
    fontStyle: "italic",
  },
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
    backgroundColor: "#222",
    borderRadius: 25,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "white",
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    padding: 10,
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
  loadMoreText: {
    color: colors.blue1,
    fontSize: 14,
    fontWeight: "600",
  },
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