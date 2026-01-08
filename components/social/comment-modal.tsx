import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Comment {
  id: string;
  authorName: string;
  authorImage?: string;
  text: string;
  timestamp: any; // Can be Date object or Firestore Timestamp
}

interface CommentModalProps {
  visible: boolean;
  postTitle: string;
  comments: Comment[];
  onClose: () => void;
  onSubmitComment: (text: string) => void;
  isLoading?: boolean;
}

export default function CommentModal({
  visible,
  postTitle,
  comments,
  onClose,
  onSubmitComment,
  isLoading = false,
}: CommentModalProps) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmitComment(commentText);
      setCommentText("");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-gray-800 px-4 py-3 flex-row items-center justify-between">
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="chevron-back" size={24} color="#FF4D4D" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold flex-1 ml-4 truncate">
            {postTitle}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <View className="px-4 py-3 border-b border-gray-800">
              <View className="flex-row">
                <View className="w-8 h-8 bg-primary rounded-full justify-center items-center mr-3">
                  <Text className="text-white font-bold text-xs">
                    {item.authorName.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-white font-semibold text-sm">
                      {item.authorName}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {typeof item.timestamp === "string"
                        ? item.timestamp
                        : item.timestamp?.toDate?.()?.toLocaleDateString("nl-NL") ||
                          new Date().toLocaleDateString("nl-NL")}
                    </Text>
                  </View>
                  <Text className="text-gray-300 text-sm mt-1">
                    {item.text}
                  </Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <Ionicons name="chatbubbles-outline" size={48} color="#A0A0A0" />
              <Text className="text-gray-400 mt-4">Nog geen reacties</Text>
              <Text className="text-gray-500 text-xs mt-2">
                Wees de eerste om te reageren
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Input Field */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="border-t border-gray-800 px-4 py-3 bg-surface"
        >
          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 bg-background border border-gray-700 rounded-2xl px-4 py-2 text-white text-sm"
              placeholder="Voeg een reactie toe..."
              placeholderTextColor="#666"
              value={commentText}
              onChangeText={setCommentText}
              editable={!isLoading}
            />
            <TouchableOpacity
              className={`p-2 rounded-full ${
                commentText.trim() ? "bg-primary" : "bg-gray-700"
              }`}
              onPress={handleSubmit}
              disabled={!commentText.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={20}
                color={commentText.trim() ? "white" : "#A0A0A0"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
