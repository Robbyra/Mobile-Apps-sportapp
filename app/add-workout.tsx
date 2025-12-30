import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AddWorkoutScreen() {
  const router = useRouter(); // De controller van je app

  // Hier houden we bij wat de gebruiker typet
  const [oefening, setOefening] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [gewicht, setGewicht] = useState('');

  // Functie die wordt uitgevoerd als je op de rode knop drukt
  const handleToevoegen = () => {
    // Checked of alles wat nodig is ingevuld is
    if (!oefening || !sets || !reps) {
      Alert.alert("Oeps", "Vul minstens de oefening, sets en reps in.");
      return;
    }

    // logged in console moet nog data base opslaan
    console.log("Nieuwe workout:", { oefening, sets, reps, gewicht });

    // Toon een bevestiging en ga terug naar het dashboard
    Alert.alert("Succes", "Workout toegevoegd!", [
      { text: "OK", onPress: () => router.back() } // Gaat terug naar vorige scherm
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-4">
        
        <Text className="text-white text-3xl font-bold mb-2">Workout toevoegen</Text>
        <Text className="text-gray-400 mb-8">Log je training en hou je voortgang bij</Text>

        <View className="mb-4">
          <Text className="text-gray-300 mb-2 font-semibold">Oefening</Text>
          <TextInput
            className="bg-surface text-white border border-gray-800 rounded-xl p-4 text-lg"
            placeholder="Bv. Bench press"
            placeholderTextColor="#666"
            value={oefening}
            onChangeText={setOefening} // Update de state als je typt
          />
        </View>

        <View className="flex-row justify-between mb-4 gap-2">
          <View className="flex-1">
            <Text className="text-gray-300 mb-2 font-semibold">Sets</Text>
            <TextInput
              className="bg-surface text-white border border-gray-800 rounded-xl p-4 text-lg text-center"
              placeholder="0"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={sets}
              onChangeText={setSets}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-300 mb-2 font-semibold">Reps</Text>
            <TextInput
              className="bg-surface text-white border border-gray-800 rounded-xl p-4 text-lg text-center"
              placeholder="0"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-300 mb-2 font-semibold">Kg</Text>
            <TextInput
              className="bg-surface text-white border border-gray-800 rounded-xl p-4 text-lg text-center"
              placeholder="0"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={gewicht}
              onChangeText={setGewicht}
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-gray-300 mb-2 font-semibold">Commentaar</Text>
          <TextInput
            className="bg-surface text-white border border-gray-800 rounded-xl p-4 text-lg h-32"
            placeholder="Optioneel..."
            placeholderTextColor="#666"
            multiline={true}
            textAlignVertical="top" // Zorgt dat tekst linksboven begint
          />
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity 
            className="bg-primary flex-1 py-4 rounded-xl items-center"
            onPress={handleToevoegen}
          >
            <Text className="text-white font-bold text-lg">Toevoegen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-surface border border-gray-700 flex-1 py-4 rounded-xl items-center"
            onPress={() => router.back()} // Gaat terug zonder op te slaan
          >
            <Text className="text-white font-bold text-lg">Terug</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}