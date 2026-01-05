import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <--- Belangrijk voor navigatie

// Define what a workout looks like
export type WorkoutItem = {
  id: string;
  title: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

type Props = {
  item: WorkoutItem;
};

const WorkoutCard = ({ item }: Props) => {
  const router = useRouter(); // <--- De navigator

  return (
    <TouchableOpacity 
      className="bg-surface p-4 rounded-xl mb-3 border border-gray-800 flex-row justify-between items-center"
      // HERE IS THE LINK: We navigate to the file app/workout/[id].tsx
      onPress={() => router.push(`/workout/${item.id}`)} 
    >
      
      {/* Left side: Text info */}
      <View>
        <Text className="text-white font-bold text-lg">{item.title}</Text>
        <Text className="text-gray-400 mt-1">
          {item.sets} sets x {item.reps} reps — {item.weight} kg
        </Text>
      </View>

      {/* Right side: Icon and Date */}
      <View className="items-end">
        <Text className="text-gray-500 text-xs mb-1">{item.date}</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>

    </TouchableOpacity>
  );
};

export default WorkoutCard;