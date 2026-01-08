import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import WorkoutCard, { WorkoutItem } from '@/components/WorkoutCard';

export default function WorkoutsScreen() {
  const router = useRouter();

  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Haal workouts op, gesorteerd op datum (nieuwste eerst)
    const q = query(collection(db, 'workouts'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Naamloos',
          date: data.date || 'Geen datum',
          
          type: data.type || 'strength', 
          
          // Kracht data ophalen
          sets: data.sets || 0,
          reps: data.reps || 0,
          weight: data.weight || 0,
          
          // Cardio data ophalen
          distance: data.distance || 0,
          duration: data.duration || 0,
          calories: data.calories || 0,
        } as WorkoutItem;
      });

      setWorkouts(liveData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#FF4D4D" />
        <Text className="text-gray-400 mt-4">Workouts laden...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      {/* Header sectie */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-3xl font-bold">Workouts</Text>
        <TouchableOpacity 
          className="bg-primary px-4 py-2 rounded-lg"
          onPress={() => router.push('/add-workout')}
        >
          <Text className="text-white font-bold">+ Nieuw</Text>
        </TouchableOpacity>
      </View>

      {/* De Lijst */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="mb-3"
            onPress={() => router.push(`/workout/${item.id}`)}
          >
            <WorkoutCard item={item} />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <Text className="text-white text-lg font-bold">Geen workouts gevonden</Text>
            <Text className="text-gray-500 text-center mt-2">
              Start je eerste activiteit door op + Nieuw te klikken.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}