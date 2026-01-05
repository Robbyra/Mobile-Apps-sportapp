import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

// Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function EditNutritionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔄 Haal bestaande data op
  useEffect(() => {
    const loadNutrition = async () => {
      if (!id) return;

      const ref = doc(db, "nutrition", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        Alert.alert("Error", "Voeding niet gevonden");
        router.back();
        return;
      }

      const data = snap.data();
      setName(data.name ?? "");
      setCalories(String(data.calories ?? ""));
      setProtein(String(data.protein ?? ""));
      setCarbs(String(data.carbs ?? ""));
      setFats(String(data.fats ?? ""));
      setLoading(false);
    };

    loadNutrition();
  }, [id, router]);

  // 💾 Opslaan
  const handleUpdate = async () => {
    if (!name || !calories) {
      Alert.alert("Fout", "Naam en calorieën zijn verplicht");
      return;
    }

    await updateDoc(doc(db, "nutrition", id!), {
      name,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
    });

    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#FF4D4D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <Text className="text-white text-3xl font-bold mb-6">Bewerk voeding</Text>

      {/* NAAM */}
      <View className="mb-4">
        <Text className="text-gray-400 mb-1">Naam</Text>
        <TextInput
          className="bg-surface text-white p-4 rounded-xl border border-gray-800"
          placeholder="Ontbijt, Lunch..."
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* CALORIEËN */}
      <View className="mb-4">
        <Text className="text-gray-400 mb-1">Calorieën (kcal)</Text>
        <TextInput
          className="bg-surface text-white p-4 rounded-xl border border-gray-800"
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
        />
      </View>

      {/* MACROS – exact zelfde layout als create */}
      <View className="flex-row justify-between mb-6">
        <View className="flex-1 mx-1">
          <Text className="text-gray-400 mb-1 text-center">Eiwit (g)</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 text-center"
            keyboardType="numeric"
            value={protein}
            onChangeText={setProtein}
          />
        </View>

        <View className="flex-1 mx-1">
          <Text className="text-gray-400 mb-1 text-center">
            Koolhydraten (g)
          </Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 text-center"
            keyboardType="numeric"
            value={carbs}
            onChangeText={setCarbs}
          />
        </View>

        <View className="flex-1 mx-1">
          <Text className="text-gray-400 mb-1 text-center">Vetten (g)</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 text-center"
            keyboardType="numeric"
            value={fats}
            onChangeText={setFats}
          />
        </View>
      </View>

      {/* OPSLAAN */}
      <TouchableOpacity
        className="bg-primary py-4 rounded-xl items-center"
        onPress={handleUpdate}
      >
        <Text className="text-white font-bold text-lg">
          Opslaan wijzigingen
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
