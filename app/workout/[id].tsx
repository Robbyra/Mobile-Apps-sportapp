import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, 'workouts', id as string);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setWorkout({ id: docSnap.id, ...docSnap.data() });
      } else {
        setWorkout(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // functie om workout te verwijderen
  const handleDelete = async () => {
    Alert.alert(
      "Verwijderen",
      "Weet je zeker dat je deze activiteit wilt verwijderen?",
      [
        { text: "Annuleren", style: "cancel" },
        { 
          text: "Verwijder", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'workouts', id as string));
              router.back(); 
            } catch (error) {
              Alert.alert("Fout", "Kon niet verwijderen.");
            }
          }
        }
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
        <Text className="text-white">Activiteit niet gevonden.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-gray-800 p-3 rounded-lg">
           <Text className="text-white">Ga terug</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // checked of het een cardio workout is
  const isCardio = workout.type === 'cardio';

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-2 flex-row items-center justify-between border-b border-gray-800 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#FF4D4D" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Details</Text>
        </View>

        <TouchableOpacity onPress={handleDelete}>
           <Ionicons name="trash-outline" size={24} color="#FF4D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-5">
        
        {/* Title Card */}
        <View className="bg-surface p-6 rounded-2xl border border-gray-800 mb-6">
          <Text className="text-gray-400 text-sm mb-1">{workout.date}</Text>
          <Text className="text-white text-3xl font-bold mb-4">{workout.title}</Text>
          
          {/* --- Type Checken --- */}
          <View className="flex-row justify-between bg-background p-4 rounded-xl">
             
             {isCardio ? (
               // cardio weergave
               <>
                 <View className="items-center flex-1">
                    <Text className="text-gray-400 text-xs uppercase">Afstand</Text>
                    <Text className="text-primary text-xl font-bold">{workout.distance || 0}</Text>
                    <Text className="text-gray-500 text-xs">km</Text>
                 </View>
                 <View className="items-center flex-1 border-l border-gray-800">
                    <Text className="text-gray-400 text-xs uppercase">Tijd</Text>
                    <Text className="text-primary text-xl font-bold">{workout.duration || 0}</Text>
                    <Text className="text-gray-500 text-xs">min</Text>
                 </View>
                 <View className="items-center flex-1 border-l border-gray-800">
                    <Text className="text-gray-400 text-xs uppercase">Verbrand</Text>
                    <Text className="text-primary text-xl font-bold">{workout.calories || 0}</Text>
                    <Text className="text-gray-500 text-xs">kcal</Text>
                 </View>
               </>
             ) : (
               // Kracht weergave
               <>
                 <View className="items-center flex-1">
                    <Text className="text-gray-400 text-xs uppercase">Sets</Text>
                    <Text className="text-primary text-xl font-bold">{workout.sets || 0}</Text>
                 </View>
                 <View className="items-center flex-1 border-l border-gray-800">
                    <Text className="text-gray-400 text-xs uppercase">Reps</Text>
                    <Text className="text-primary text-xl font-bold">{workout.reps || 0}</Text>
                 </View>
                 <View className="items-center flex-1 border-l border-gray-800">
                    <Text className="text-gray-400 text-xs uppercase">Gewicht</Text>
                    <Text className="text-primary text-xl font-bold">{workout.weight || 0}</Text>
                    <Text className="text-gray-500 text-xs">kg</Text>
                 </View>
               </>
             )}

          </View>
        </View>

        {/* Extra info*/}
        {isCardio && (
             <View className="bg-surface p-4 rounded-xl border border-gray-800 flex-row items-center justify-center">
                 <Ionicons name="flame" size={24} color="#FF4D4D" style={{marginRight: 10}} />
                 <Text className="text-white font-semibold">
                    Goed bezig! Je hebt {workout.calories} kcal verbrand.
                 </Text>
             </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}