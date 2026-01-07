import NutritionCard from '@/components/NutriotionCard';
import PostToSocialModal from '@/components/PostToSocialModal';
import { db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NutritionItem } from '../meal/[id]';

export default function DashboardScreen() {
  const router = useRouter();
  const currentUserId = 'user-123';
  const currentUserName = 'Jouw Naam';

  const [meals, setMeals] = useState<NutritionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<NutritionItem | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'nutrition'), (snapshot) => {
      const liveData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unnamed meal',
          calories: data.calories || 0,
          protein: data.protein || 0,
          carbs: data.carbs || 0,
          fats: data.fats || 0,
          date: data.date || 'No date',
        } as NutritionItem;
      });

      setMeals(liveData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#FF4D4D" />
        <Text className="text-gray-400 mt-4">Loading nutrition...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-3xl font-bold">Voeding</Text>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-lg"
          onPress={() => router.push('/add-nutriotion')}
        >
          <Text className="text-white font-bold">+ Nieuw</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-3 mb-3">
            <View className="flex-1">
              <NutritionCard item={item} />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <Text className="text-white text-lg font-bold">Geen maaltijden</Text>
            <Text className="text-gray-500 text-center mt-2">
              Voeg je eerste maaltijd toe om hier data te zien.
            </Text>
          </View>
        }
      />

      {selectedMeal && (
        <PostToSocialModal
          visible={showPostModal}
          onClose={() => setShowPostModal(false)}
          type="meal"
          item={selectedMeal}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
      )}
    </SafeAreaView>
  );
}