import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Firebase imports
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real data from Firebase based on ID
  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "workouts", id as string);

    // Listen to changes (real-time)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setWorkout({ id: docSnap.id, ...docSnap.data() });
      } else {
        // Document deleted or doesn't exist
        setWorkout(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // 2. Function to delete the workout
  const handleDelete = async () => {
    Alert.alert(
      "Verwijderen",
      "Weet je zeker dat je deze workout wilt verwijderen?",
      [
        { text: "Annuleren", style: "cancel" },
        {
          text: "Verwijder",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "workouts", id as string));
              router.back(); // Go back to the list
            } catch (error) {
              Alert.alert("Fout", "Kon niet verwijderen.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator color="#FF4D4D" />
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-white">
          Workout niet gevonden (of verwijderd).
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-gray-800 p-3 rounded-lg"
        >
          <Text className="text-white">Ga terug</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="px-4 py-2 flex-row items-center justify-between border-b border-gray-800 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#FF4D4D" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Details</Text>
        </View>

        {/* Delete Icon */}
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF4D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-5">
        {/* Title Card */}
        <View className="bg-surface p-6 rounded-2xl border border-gray-800 mb-6">
          <Text className="text-gray-400 text-sm mb-1">{workout.date}</Text>
          <Text className="text-white text-3xl font-bold mb-4">
            {workout.title}
          </Text>

          <View className="flex-row justify-between bg-background p-4 rounded-xl">
            <View className="items-center flex-1">
              <Text className="text-gray-400 text-xs">SETS</Text>
              <Text className="text-primary text-xl font-bold">
                {workout.sets}
              </Text>
            </View>
            <View className="items-center flex-1 border-l border-gray-800">
              <Text className="text-gray-400 text-xs">REPS</Text>
              <Text className="text-primary text-xl font-bold">
                {workout.reps}
              </Text>
            </View>
            <View className="items-center flex-1 border-l border-gray-800">
              <Text className="text-gray-400 text-xs">KG</Text>
              <Text className="text-primary text-xl font-bold">
                {workout.weight}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
