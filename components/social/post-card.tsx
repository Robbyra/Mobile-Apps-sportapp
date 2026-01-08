import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PostCardProps {
  id: string;
  authorName: string;
  authorImage?: string;
  type: "workout" | "meal";
  title: string;
  description: string;
  stats: string;
  caloriesBurned?: number;
  likes: number;
  timestamp: string;
  onPress?: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onComment?: () => void;
  isLiked?: boolean;
  isSaved?: boolean;
  comments?: number;
}

export default function PostCard({
  authorName,
  authorImage,
  type,
  title,
  description,
  stats,
  caloriesBurned,
  likes,
  timestamp,
  onPress,
  onLike,
  onSave,
  onComment,
  isLiked = false,
  isSaved = false,
  comments = 0,
}: PostCardProps) {
  return (
    <TouchableOpacity
      className="bg-surface p-4 rounded-2xl mb-4 border border-gray-800"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-primary rounded-full mr-3 justify-center items-center">
            {authorImage ? (
              <Image
                source={{ uri: authorImage }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <Text className="text-white font-bold">
                {authorName.charAt(0)}
              </Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold">{authorName}</Text>
            <Text className="text-gray-400 text-xs">{timestamp}</Text>
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            type === "workout"
              ? "bg-primary bg-opacity-20"
              : "bg-yellow-500 bg-opacity-20"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              type === "workout" ? "text-primary" : "text-yellow-400"
            }`}
          >
            {type === "workout" ? "💪 Workout" : "🍽️ Meal"}
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-white text-lg font-bold mb-1">{title}</Text>
        <Text className="text-gray-300 text-sm mb-2">{description}</Text>
        <Text className="text-primary font-semibold text-sm">{stats}</Text>
      </View>

      {caloriesBurned && (
        <View className="bg-background rounded-lg p-3 mb-3 flex-row items-center">
          <Ionicons name="flame" size={16} color="#FF4D4D" />
          <Text className="text-white font-semibold ml-2">
            +{caloriesBurned} kcal
          </Text>
        </View>
      )}

      <View className="flex-row justify-between items-center pt-3 border-t border-gray-800">
        <TouchableOpacity
          className="flex-row items-center flex-1 justify-center py-2"
          onPress={onLike}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={18}
            color={isLiked ? "#FF4D4D" : "#A0A0A0"}
          />
          <Text
            className={`ml-2 font-semibold ${
              isLiked ? "text-primary" : "text-gray-400"
            }`}
          >
            {likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center flex-1 justify-center py-2 border-l border-r border-gray-800"
          onPress={onSave}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={18}
            color={isSaved ? "#FF4D4D" : "#A0A0A0"}
          />
          <Text
            className={`ml-2 font-semibold ${
              isSaved ? "text-primary" : "text-gray-400"
            }`}
          >
            Opslaan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center flex-1 justify-center py-2"
          onPress={onComment}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#A0A0A0" />
          <Text className="ml-2 font-semibold text-gray-400">
            {comments > 0 ? comments : "Reageer"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
