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

export interface NutritionItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date?: string;
}

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [meal, setMeal] = useState<NutritionItem | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real data from Firebase based on ID
  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "nutrition", id as string);

    // Listen to changes (real-time)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setMeal({ id: docSnap.id, ...docSnap.data() } as NutritionItem);
      } else {
        setMeal(null); // Document deleted or doesn't exist
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // 2. Function to delete the meal
  const handleDelete = async () => {
    Alert.alert(
      "Verwijderen",
      "Weet je zeker dat je deze maaltijd wilt verwijderen?",
      [
        { text: "Annuleren", style: "cancel" },
        {
          text: "Verwijder",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "nutrition", id as string));
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

  if (!meal) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-white">
          Maaltijd niet gevonden (of verwijderd).
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
      {/* Header */}
      <View className="px-4 py-2 flex-row items-center justify-between border-b border-gray-800 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#FF4D4D" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Meal Details</Text>
        </View>

        {/* Delete Icon */}
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF4D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-5">
        {/* Meal Card */}
        <View className="bg-surface p-6 rounded-2xl border border-gray-800 mb-6">
          {meal.date && (
            <Text className="text-gray-400 text-sm mb-1">{meal.date}</Text>
          )}
          <Text className="text-white text-3xl font-bold mb-4">
            {meal.name}
          </Text>

          <View className="flex-row justify-between bg-background p-4 rounded-xl">
            <View className="items-center flex-1">
              <Text className="text-gray-400 text-xs">CALORIES</Text>
              <Text className="text-primary text-xl font-bold">
                {meal.calories} kcal
              </Text>
            </View>
            <View className="items-center flex-1 border-l border-gray-800">
              <Text className="text-gray-400 text-xs">PROTEIN</Text>
              <Text className="text-primary text-xl font-bold">
                {meal.protein}g
              </Text>
            </View>
            <View className="items-center flex-1 border-l border-gray-800">
              <Text className="text-gray-400 text-xs">CARBS</Text>
              <Text className="text-primary text-xl font-bold">
                {meal.carbs}g
              </Text>
            </View>
            <View className="items-center flex-1 border-l border-gray-800">
              <Text className="text-gray-400 text-xs">FATS</Text>
              <Text className="text-primary text-xl font-bold">
                {meal.fats}g
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
