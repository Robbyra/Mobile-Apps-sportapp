import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { NutritionItem } from '@/app/meal/[id]';

type Props = {
  item: NutritionItem;
};

export default function NutritionCard({ item }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="bg-surface p-4 rounded-xl mb-3 border border-gray-800 flex-row justify-between items-center"
      onPress={() =>
        router.push({
          pathname: '/meal/[id]',
          params: { id: item.id },
        })
      }
    >
      {/* LEFT: Meal info */}
      <View className="flex-1 mr-2">
        <Text
          className="text-white text-lg font-bold mb-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>

        {/* Macros row */}
        <View className="flex-row flex-wrap gap-3">
          <Text className="text-gray-400">🔥 {item.calories} kcal</Text>
          <Text className="text-gray-400">🥩 {item.protein}g</Text>
          <Text className="text-gray-400">🍞 {item.carbs}g</Text>
          <Text className="text-gray-400">🥑 {item.fats}g</Text>
        </View>
      </View>

      {/* RIGHT: Date + Chevron */}
      <View className="items-end">
        {item.date && <Text className="text-gray-500 text-xs mb-1">{item.date}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );
}
