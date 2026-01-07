import { NutritionItem } from "@/app/meal/[id]";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  meals: NutritionItem[];
  onClose: () => void;
  onSelect: (meal: NutritionItem) => void;
};

export default function SelectMealModal({
  visible,
  meals,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-background p-4">
        <Text className="text-white text-xl font-bold mb-4">
          Kies een maaltijd
        </Text>

        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-surface p-4 rounded-xl mb-3 border border-gray-800"
              onPress={() => onSelect(item)}
            >
              <Text className="text-white font-semibold">{item.name}</Text>
              <Text className="text-gray-400 text-xs">
                {item.calories} kcal
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}
