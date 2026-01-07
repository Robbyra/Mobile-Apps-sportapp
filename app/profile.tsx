import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Firebase
import {
  collection,
  getCountFromServer,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ workouts: 0, minutes: 0, friends: 0 });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 1. Tel het aantal workouts
        const workoutsColl = collection(db, "workouts");
        const workoutsSnapshot = await getCountFromServer(workoutsColl);
        const count = workoutsSnapshot.data().count;

        // Schatten van minuten (bijv. gem. 45 min per workout)
        const estMinutes = count * 45;

        // 2. Tel Vrienden (via de hardcoded user 'user-123' van je teamgenoot)
        const userDocRef = doc(db, "users", "user-123");
        const userSnap = await getDoc(userDocRef);
        let friendsCount = 0;

        if (userSnap.exists()) {
          const data = userSnap.data();
          // Kijk of de friends array bestaat en tel de lengte
          if (data.friends && Array.isArray(data.friends)) {
            friendsCount = data.friends.length;
          }
        }

        setStats({
          workouts: count,
          minutes: estMinutes,
          friends: friendsCount,
        });
        setLoading(false);
      } catch (e) {
        console.error("Fout bij laden profiel:", e);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-2 mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FF4D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {/* Avatar & Naam */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-surface rounded-full items-center justify-center border-2 border-primary mb-4">
            <Text className="text-white text-4xl font-bold">J</Text>
          </View>
          <Text className="text-white text-2xl font-bold">Jouw Naam</Text>
          <Text className="text-gray-400">Lid sinds 2024</Text>
        </View>

        {/* Statistieken Blokje - NU ECHT GECONNECT */}
        <View className="flex-row justify-between bg-surface p-6 rounded-2xl border border-gray-800 mb-6">
          <View className="items-center flex-1">
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-xl font-bold">
                {stats.workouts}
              </Text>
            )}
            <Text className="text-gray-400 text-xs mt-1">Workouts</Text>
          </View>
          <View className="w-px bg-gray-700" />
          <View className="items-center flex-1">
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-xl font-bold">
                {stats.minutes}
              </Text>
            )}
            <Text className="text-gray-400 text-xs mt-1">Minuten</Text>
          </View>
          <View className="w-px bg-gray-700" />
          <View className="items-center flex-1">
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-xl font-bold">
                {stats.friends}
              </Text>
            )}
            <Text className="text-gray-400 text-xs mt-1">Vrienden</Text>
          </View>
        </View>

        {/* Instellingen (Statisch) */}
        <View className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-800">
            <Ionicons name="settings-outline" size={22} color="white" />
            <Text className="text-white ml-3 font-semibold flex-1">
              Instellingen
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-4">
            <Ionicons name="log-out-outline" size={22} color="#FF4D4D" />
            <Text className="text-primary ml-3 font-semibold flex-1">
              Uitloggen
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
