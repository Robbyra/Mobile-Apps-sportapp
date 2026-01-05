import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface NutritionItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date?: string;
}

export default function NutritionCard({ item }: { item: NutritionItem }) {
  const router = useRouter();

  const handleDelete = async () => {
    Alert.alert(
      'Verwijderen',
      'Weet je zeker dat je deze maaltijd wilt verwijderen?',
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Verwijder',
          style: 'destructive',
          onPress: async () => {
            await deleteDoc(doc(db, 'nutrition', item.id));
          },
        },
      ]
    );
  };

  return (
    <View className="bg-surface p-4 rounded-xl mb-3 border border-gray-800">
      
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-lg font-bold">{item.name}</Text>
        <Text className="text-gray-300 font-semibold">{item.calories} kcal</Text>
      </View>

      {/* MACROS */}
      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-400">🥩 {item.protein}g</Text>
        <Text className="text-gray-400">🍞 {item.carbs}g</Text>
        <Text className="text-gray-400">🥑 {item.fats}g</Text>
      </View>

      {/* ACTIONS */}
      <View className="flex-row justify-end gap-3">
        <TouchableOpacity
          className="px-4 py-2 rounded-lg border border-gray-700"
          onPress={() =>
            router.push({
              pathname: '/edit-nutrition',
              params: { id: item.id },
            })
          }
        >
          <Text className="text-white">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-4 py-2 rounded-lg bg-red-600"
          onPress={handleDelete}
        >
          <Text className="text-white font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
