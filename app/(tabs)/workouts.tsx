import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import WorkoutCard, { WorkoutItem } from '@/components/WorkoutCard';

// Firebase imports
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function WorkoutsScreen() {
  const router = useRouter();

  // State to store the list of workouts and the loading status
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect to set up the real-time connection with Firebase
  useEffect(() => {
    // onSnapshot listens for real-time updates in the 'workouts' collection
    const unsubscribe = onSnapshot(collection(db, 'workouts'), (snapshot) => {
      
      // Maps the Firestore documents to our WorkoutItem type
      const liveData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // Gets the document ID from Firestore
          title: data.title || 'Untitled Workout',
          sets: data.sets || 0,
          reps: data.reps || 0,
          weight: data.weight || 0,
          date: data.date || 'No date',
        } as WorkoutItem;
      });

      // Updates state with the new data and stop the loading spinner
      setWorkouts(liveData);
      setLoading(false);
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Shows a loading spinner while data is being fetched
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
      {/* Header section with Title and 'New' button */}
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
        renderItem={({ item }) => <WorkoutCard item={item} />}
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
    </SafeAreaView>
  );
}