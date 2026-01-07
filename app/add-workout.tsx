import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AddWorkoutScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // KEUZE: 'strength' of 'cardio'
  const [type, setType] = useState<'strength' | 'cardio'>('strength'); 

  const [title, setTitle] = useState('');
  
  // Kracht velden
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  // Cardio velden
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const handleSave = async () => {
    if (!title) {
      Alert.alert('Fout', 'Vul een naam in');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'workouts'), {
        title,
        type, // We slaan op welk type het is
        date: new Date().toLocaleDateString('nl-NL'),
        timestamp: new Date(),
        
        // Sla kracht-data alleen op als het type kracht is
        sets: type === 'strength' ? Number(sets) : null,
        reps: type === 'strength' ? Number(reps) : null,
        weight: type === 'strength' ? Number(weight) : null,
        
        // Sla cardio-data alleen op als het type cardio is
        distance: type === 'cardio' ? Number(distance) : null,
        duration: type === 'cardio' ? Number(duration) : null,
        calories: type === 'cardio' ? Number(calories) : null,
      });

      setLoading(false);
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Kon niet opslaan');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-4">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#FF4D4D" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Nieuwe Activiteit</Text>
        </View>

        {/* --- TYPE SWITCHER --- */}
        <View className="flex-row mb-6 bg-surface p-1 rounded-xl border border-gray-800">
          <TouchableOpacity 
            onPress={() => setType('strength')}
            className={`flex-1 p-3 rounded-lg items-center ${type === 'strength' ? 'bg-primary' : 'bg-transparent'}`}>
            <Text className="text-white font-bold">Kracht</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setType('cardio')}
            className={`flex-1 p-3 rounded-lg items-center ${type === 'cardio' ? 'bg-primary' : 'bg-transparent'}`}>
            <Text className="text-white font-bold">Cardio</Text>
          </TouchableOpacity>
        </View>

        {/* Naam Input */}
        <Text className="text-gray-400 mb-2 ml-1">Naam Activiteit</Text>
        <TextInput 
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 mb-4"
            placeholder={type === 'strength' ? "Bijv. Bench Press" : "Bijv. Hardlopen"}
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
        />

        {/* --- KRACHT VELDEN --- */}
        {type === 'strength' && (
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-gray-400 mb-2 ml-1">Sets</Text>
              <TextInput className="bg-surface text-white p-4 rounded-xl border border-gray-800" keyboardType="numeric" value={sets} onChangeText={setSets} placeholder="0" placeholderTextColor="#666" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 mb-2 ml-1">Reps</Text>
              <TextInput className="bg-surface text-white p-4 rounded-xl border border-gray-800" keyboardType="numeric" value={reps} onChangeText={setReps} placeholder="0" placeholderTextColor="#666" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 mb-2 ml-1">KG</Text>
              <TextInput className="bg-surface text-white p-4 rounded-xl border border-gray-800" keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="0" placeholderTextColor="#666" />
            </View>
          </View>
        )}

        {/* --- CARDIO VELDEN --- */}
        {type === 'cardio' && (
          <View>
             <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-gray-400 mb-2 ml-1">Afstand (km)</Text>
                <TextInput className="bg-surface text-white p-4 rounded-xl border border-gray-800" keyboardType="numeric" placeholder="5.0" placeholderTextColor="#666" value={distance} onChangeText={setDistance} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 mb-2 ml-1">Tijd (min)</Text>
                <TextInput className="bg-surface text-white p-4 rounded-xl border border-gray-800" keyboardType="numeric" placeholder="30" placeholderTextColor="#666" value={duration} onChangeText={setDuration} />
              </View>
            </View>
            <Text className="text-gray-400 mb-2 ml-1">Verbrande Calorieën (kcal)</Text>
            <TextInput className="bg-surface text-white p-4 rounded-xl border border-gray-800" keyboardType="numeric" placeholder="300" placeholderTextColor="#666" value={calories} onChangeText={setCalories} />
          </View>
        )}

        <TouchableOpacity 
          className="bg-primary p-4 rounded-xl mt-8 items-center" 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Opslaan</Text>}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}