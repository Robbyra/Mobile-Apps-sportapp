import { useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Data state
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [workoutCount, setWorkoutCount] = useState(0);

  const CALORIE_GOAL = 2500;

  useEffect(() => {
    const qWorkouts = query(
      collection(db, "workouts"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubWorkouts = onSnapshot(qWorkouts, (snapshot) => {
      let burned = 0;
      let count = 0;

      const workouts = snapshot.docs.map((doc) => {
        const data = doc.data();

        // Kleine check
        if (data.date === new Date().toLocaleDateString("nl-NL")) {
          count++;
          // telt verbrandde calorieën alleen voor cardio workouts
          if (data.type === "cardio" && data.calories) {
            burned += Number(data.calories);
          }
        }
        return { id: doc.id, ...data };
      });

      setRecentWorkouts(workouts);
      setCaloriesBurned(burned);
      setWorkoutCount(count);
    });

    // nutrition collection voor calorieën
    const qNutrition = query(collection(db, "nutrition"));
    const unsubNutrition = onSnapshot(qNutrition, (snapshot) => {
      let eaten = 0;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        eaten += Number(data.calories || 0);
      });
      setCaloriesEaten(eaten);
      setLoading(false);
    });

    return () => {
      unsubWorkouts();
      unsubNutrition();
    };
  }, []);

  const caloriesLeft = CALORIE_GOAL - caloriesEaten + caloriesBurned;

  const progress = Math.min((caloriesEaten / CALORIE_GOAL) * 100, 100);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator color="#FF4D4D" />
      </SafeAreaView>
    );
  }

  const goalReached = caloriesEaten >= CALORIE_GOAL;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <ScrollView className="p-4">
        {/* --- HEADER --- */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">FitCircle</Text>
            <Text className="text-gray-400 text-sm">
              Workout · Voeding · Sociaal
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <View className="w-10 h-10 bg-surface rounded-full border border-gray-700 items-center justify-center">
              <Ionicons name="person" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* --- VANDAAG KAART --- */}
        <View className="bg-surface p-5 rounded-2xl mb-4 border border-gray-800">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-white text-xl font-bold">Vandaag</Text>
              <Text className="text-gray-400 text-sm">Netto Calorieën</Text>
            </View>
            <View className="items-end">
              <Text className="text-primary font-bold">
                {workoutCount} sessies
              </Text>
              <Text className="text-gray-500 text-xs">Vandaag gedaan</Text>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between items-end">
            <View className="flex-1 mr-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-300 text-xs">
                  Eten: {caloriesEaten}
                </Text>
                <Text className="text-gray-300 text-xs">
                  Doel: {CALORIE_GOAL}
                </Text>
              </View>
              {/* Progress Bar */}
              <View className="h-2 bg-gray-700 rounded-full w-full overflow-hidden">
                <View
                  style={{ width: `${progress}%` }}
                  className={`h-full rounded-full ${
                    goalReached ? "bg-green-500" : "bg-primary"
                  }`}
                />
              </View>
            </View>

            <View className="items-end">
              {goalReached ? (
                <Text className="text-primary text-lg font-bold mt-2">
                  🎉 Doel behaald!
                </Text>
              ) : (
                <>
                  <Text className="text-gray-400 text-xs mb-1">Resterend</Text>
                  <Text className="text-white text-2xl font-bold">
                    {caloriesLeft}
                  </Text>
                  <Text className="text-gray-400 text-xs">kcal</Text>
                </>
              )}

              <Text className="text-white text-2xl font-bold">
                {caloriesLeft}
              </Text>
              <Text className="text-gray-400 text-xs">kcal</Text>
            </View>
          </View>
        </View>

        {/* --- SNELLE ACTIES --- */}
        <Text className="text-white text-lg font-bold mb-4">Snelle acties</Text>
        <View className="flex-row gap-3 mb-8">
          {/* Workout toevoegen */}
          <TouchableOpacity
            className="flex-1 bg-primary p-4 rounded-xl items-center"
            onPress={() => router.push("/add-workout")}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color="white"
              className="mb-2"
            />
            <Text className="text-white font-bold">Activiteit</Text>
          </TouchableOpacity>

          {/*Voeding toevoegen*/}
          <TouchableOpacity
            className="flex-1 bg-surface border border-gray-800 p-4 rounded-xl items-center"
            onPress={() => router.push("/add-nutriotion")}
          >
            <Ionicons
              name="nutrition-outline"
              size={24}
              color="white"
              className="mb-2"
            />
            <Text className="text-white font-bold">Voeding</Text>
          </TouchableOpacity>
        </View>

        {/* --- RECENTE ACTIVITEITEN --- */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg font-bold">
            Recente activiteiten
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/workouts")}>
            <Text className="text-primary text-sm">Alles zien</Text>
          </TouchableOpacity>
        </View>

        {recentWorkouts.length === 0 ? (
          <Text className="text-gray-500 italic">
            Nog geen activiteiten gelogd.
          </Text>
        ) : (
          recentWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              className="bg-surface p-4 rounded-xl mb-3 border border-gray-800 flex-row justify-between items-center"
              onPress={() => router.push(`/workout/${workout.id}`)}
            >
              <View>
                <Text className="text-white font-bold text-lg">
                  {workout.title}
                </Text>

                {/* We tonen andere info afhankelijk van het type */}
                {workout.type === "cardio" ? (
                  <Text className="text-gray-400 text-xs">
                    {workout.distance} km • {workout.duration} min
                  </Text>
                ) : (
                  <Text className="text-gray-400 text-xs">
                    Kracht • {workout.sets} sets • {workout.weight} kg
                  </Text>
                )}
              </View>

              {/* Alleen vuur-icoon tonen als er calorieën zijn (Cardio) */}
              {workout.type === "cardio" && workout.calories ? (
                <View className="flex-row items-center">
                  <Ionicons name="flame" size={16} color="#FF4D4D" />
                  <Text className="text-gray-300 ml-1">
                    +{workout.calories}
                  </Text>
                </View>
              ) : (
                <Ionicons name="barbell-outline" size={20} color="#666" />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
