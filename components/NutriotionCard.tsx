import { View, Text } from 'react-native';

export interface NutritionItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
}

export default function NutritionCard({ item }: { item: NutritionItem }) {
  return (
    <View className="bg-surface p-4 rounded-xl mb-3 border border-gray-800">
      
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-lg font-bold">{item.name}</Text>
        <Text className="text-gray-300 font-semibold">{item.calories} kcal</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-gray-400">🥩 {item.protein}g</Text>
        <Text className="text-gray-400">🍞 {item.carbs}g</Text>
        <Text className="text-gray-400">🥑 {item.fats}g</Text>
      </View>

      <Text className="text-gray-500 text-xs mt-2">{item.date}</Text>
    </View>
  );
}
