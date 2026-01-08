import { db } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PostToSocialModalProps {
  visible: boolean;
  onClose: () => void;
  type: "workout" | "meal";
  item: {
    id: string;
    title?: string; // voor workout
    name?: string; // voor meal
    
    // Kracht velden
    sets?: number;
    reps?: number;
    weight?: number;
    
    // Cardio velden
    distance?: number;
    duration?: number;
    
    // Algemeen
    type?: string; 
    calories?: number;
    [key: string]: any;
  };
  currentUserId: string;
  currentUserName: string;
}

export default function PostToSocialModal({
  visible,
  onClose,
  type,
  item,
  currentUserId,
  currentUserName,
}: PostToSocialModalProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset beschrijving bij openen
  useEffect(() => {
    if (visible) setDescription("");
  }, [visible]);

  // --- DEZE FUNCTIE FIKST HET PROBLEEM ---
  // Hij kijkt nu of het cardio is voordat hij de tekst maakt
  const getStatsText = () => {
    if (type === "workout") {
      // Is het Cardio? -> Toon km en min
      if (item.type === 'cardio') {
        return `${item.distance || 0} km • ${item.duration || 0} min`;
      }
      // Is het Kracht? -> Toon sets en reps
      return `${item.sets || 0} sets × ${item.reps || 0} reps — ${item.weight || 0} kg`;
    }
    // Is het een Maaltijd?
    return `${item.calories || 0} kcal`;
  };

  const handlePost = async () => {
    if (!description.trim()) {
      Alert.alert("Fout", "Voeg een beschrijving toe");
      return;
    }

    setLoading(true);
    try {
      const isWorkout = type === "workout";
      const isCardio = isWorkout && item.type === 'cardio';

      // Slimme calorie berekening
      let caloriesBurned = null;
      if (isWorkout) {
        if (isCardio) {
            // Bij cardio pakken we de echte calorieën
            caloriesBurned = item.calories ? Number(item.calories) : 0;
        } else {
            // Bij kracht doen we een schatting
            caloriesBurned = Math.round(
              (item.weight || 0) * (item.reps || 0) * (item.sets || 0) * 0.5
            );
        }
      }

      const postData = {
        authorId: currentUserId,
        authorName: currentUserName,
        authorImage: "",
        type, 
        title: isWorkout ? item.title : item.name,
        description,
        
        // Hier gebruiken we de nieuwe functie voor de database
        stats: getStatsText(),
        
        caloriesBurned: caloriesBurned,
        likes: 0,
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, "posts"), postData);

      Alert.alert(
        "Succes",
        `Je ${isWorkout ? "activiteit" : "maaltijd"} is gepost!`
      );
      onClose();
    } catch (error) {
      console.error("Fout bij posten:", error);
      Alert.alert("Fout", "Kon post niet toevoegen");
    } finally {
      setLoading(false);
    }
  };

  const itemTitle = type === "workout" ? item.title : item.name;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background p-4">
        
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white text-2xl font-bold">
            Post {type === "workout" ? "Activiteit" : "Maaltijd"}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#FF4D4D" />
          </TouchableOpacity>
        </View>

        {/* Preview Kaartje */}
        <View className="bg-surface p-4 rounded-2xl border border-gray-800 mb-6">
          <Text className="text-gray-400 text-sm mb-2">
            {type === "workout" ? "Activiteit" : "Maaltijd"}
          </Text>
          <Text className="text-white text-xl font-bold mb-2">{itemTitle}</Text>
          
          {/* HIER GEBRUIKEN WE DE NIEUWE TEKST */}
          <Text className="text-gray-300 text-sm">
             {getStatsText()}
          </Text>
        </View>

        {/* Beschrijving Input */}
        <View className="mb-6">
          <Text className="text-white font-semibold mb-2">
            Beschrijving (optioneel)
          </Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 h-32"
            placeholder="Deel je ervaringen..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />
          <Text className="text-gray-400 text-xs mt-2">
            {description.length}/200
          </Text>
        </View>

        {/* Post Knop */}
        <TouchableOpacity
          className={`p-4 rounded-xl items-center ${
            loading ? "bg-gray-600" : "bg-primary"
          }`}
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Post naar Feed</Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}