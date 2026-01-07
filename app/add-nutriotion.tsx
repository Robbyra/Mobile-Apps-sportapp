import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

// Firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function AddNutritionScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !calories) {
      Alert.alert("Fout", "Naam en calorieën zijn verplicht");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "nutrition"), {
        name,
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fats) || 0,
        createdAt: serverTimestamp(),
        // Datum toevoegen voor sortering op dashboard
        date: new Date().toLocaleDateString('nl-NL') 
      });

      router.back(); // ga terug naar nutrition lijst
    } catch (error) {
      Alert.alert("Error", "Kon voeding niet opslaan");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      
      {/* --- HEADER MET TERUG KNOP --- */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#FF4D4D" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">
          Voeg voeding toe
        </Text>
      </View>

      {/* NAAM */}
      <View className="mb-4">
        <Text className="text-gray-400 mb-1">Naam</Text>
        <TextInput
          className="bg-surface text-white p-4 rounded-xl border border-gray-800"
          placeholder="Ontbijt, Lunch, Snack..."
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* CALORIES */}
      <View className="mb-4">
        <Text className="text-gray-400 mb-1">Calorieën (kcal)</Text>
        <TextInput
          className="bg-surface text-white p-4 rounded-xl border border-gray-800"
          placeholder="450"
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
        />
      </View>

      {/* MACROS */}
      <View className="flex-row justify-between mb-6">
        {/* EIWIT */}
        <View className="flex-1 mx-1">
          <Text className="text-gray-400 mb-1 text-center">Eiwit (g)</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 text-center"
            placeholder="25"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={protein}
            onChangeText={setProtein}
          />
        </View>

        {/* KOOLHYDRATEN */}
        <View className="flex-1 mx-1">
          <Text className="text-gray-400 mb-1 text-center">
            Koolh. (g)
          </Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 text-center"
            placeholder="50"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={carbs}
            onChangeText={setCarbs}
          />
        </View>

        {/* VETTEN */}
        <View className="flex-1 mx-1">
          <Text className="text-gray-400 mb-1 text-center">Vetten (g)</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 text-center"
            placeholder="15"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={fats}
            onChangeText={setFats}
          />
        </View>
      </View>

      {/* OPSLAAN */}
      <TouchableOpacity
        className={`bg-primary py-4 rounded-xl items-center ${
          loading ? "opacity-50" : ""
        }`}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
           <ActivityIndicator color="white" />
        ) : (
           <Text className="text-white font-bold text-lg">Opslaan</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}