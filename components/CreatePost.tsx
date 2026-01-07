import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

type CreatePostModalProps = {
  visible: boolean;
  onClose: () => void;
  onMealPress: () => void;
  onWorkoutPress: () => void;
};

export default function CreatePostModal({
  visible,
  onClose,
  onMealPress,
  onWorkoutPress,
}: CreatePostModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        className="flex-1 bg-black/60 justify-center items-center"
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Modal box */}
        <View className="bg-gray-900 w-72 rounded-xl p-4">
          <Text className="text-white text-lg font-semibold mb-4 text-center">
            Wat wil je posten?
          </Text>

          {/* Maaltijd */}
          <TouchableOpacity
            className="py-3 rounded-lg bg-gray-800 mb-3"
            onPress={onMealPress}
          >
            <Text className="text-center text-white font-semibold">
              🍽️ Maaltijd
            </Text>
          </TouchableOpacity>

          {/* Workout */}
          <TouchableOpacity
            className="py-3 rounded-lg bg-gray-800"
            onPress={onWorkoutPress}
          >
            <Text className="text-center text-white font-semibold">
              💪 Workout
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
