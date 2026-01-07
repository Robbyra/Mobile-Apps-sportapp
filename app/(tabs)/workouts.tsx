import PostToSocialModal from '@/components/PostToSocialModal';
import WorkoutCard, { WorkoutItem } from '@/components/WorkoutCard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function WorkoutsScreen() {
  const router = useRouter();
  const currentUserId = 'user-123';
  const currentUserName = 'Jouw Naam';

  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'workouts'), (snapshot) => {
      const liveData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Untitled Workout',
          sets: data.sets || 0,
          reps: data.reps || 0,
          weight: data.weight || 0,
          date: data.date || 'No date',
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
        <Text className="text-gray-400 mt-4">Loading workouts...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-3xl font-bold">Workouts</Text>
        <TouchableOpacity 
          className="bg-primary px-4 py-2 rounded-lg"
          onPress={() => router.push('/add-workout')}
        >
          <Text className="text-white font-bold">+ Nieuw</Text>
        </TouchableOpacity>
      </View>

      {/* List of workouts */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-3 mb-3">
            <View className="flex-1">
              <WorkoutCard item={item} />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        // Component to render when the list is empty
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <Text className="text-white text-lg font-bold">No workouts found</Text>
            <Text className="text-gray-500 text-center mt-2">
              Add your first workout in Firebase to see it appear here.
            </Text>
          </View>
        }
      />
      {selectedWorkout && (
        <PostToSocialModal
          visible={showPostModal}
          onClose={() => setShowPostModal(false)}
          type="workout"
          item={selectedWorkout}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
      )}    </SafeAreaView>
  );
}