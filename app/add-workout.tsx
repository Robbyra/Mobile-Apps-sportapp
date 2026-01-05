import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AddWorkoutScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State for the form fields
  const [title, setTitle] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  // Function to save data to Firebase
  const handleSave = async () => {
    // Checks if fields are filled
    if (!title || !sets || !reps) {
      Alert.alert('Fout', 'Vul in ieder geval de naam, sets en reps in.');
      return;
    }

    setLoading(true);

    try {
      // Send data to the 'workouts' collection in the databaser
        await addDoc(collection(db, 'workouts'), {
        title: title,
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight) || 0,
        date: new Date().toLocaleDateString('nl-NL'), 
        
        timestamp: new Date()
      });

      // Goes back to the list
      setLoading(false);
      router.back(); 

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Kon de workout niet opslaan.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      {/* Header with Back Button */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#FF4D4D" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Nieuwe Workout</Text>
      </View>

      {/* Form Fields */}
      <View className="gap-4">
        <View>
          <Text className="text-gray-400 mb-2 ml-1">Oefening Naam</Text>
          <TextInput 
            className="bg-surface text-white p-4 rounded-xl border border-gray-800"
            placeholder="Bijv. Bench Press"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-gray-400 mb-2 ml-1">Sets</Text>
            <TextInput 
              className="bg-surface text-white p-4 rounded-xl border border-gray-800"
              placeholder="0"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={sets}
              onChangeText={setSets}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-400 mb-2 ml-1">Reps</Text>
            <TextInput 
              className="bg-surface text-white p-4 rounded-xl border border-gray-800"
              placeholder="0"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-400 mb-2 ml-1">KG</Text>
            <TextInput 
              className="bg-surface text-white p-4 rounded-xl border border-gray-800"
              placeholder="0"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          className="bg-primary p-4 rounded-xl mt-6 items-center"
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Opslaan</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}