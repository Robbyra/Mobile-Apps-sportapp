import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface WorkoutItem {
  id: string;
  title: string;
  date: string;
  type?: 'strength' | 'cardio';
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  calories?: number;
}

export default function WorkoutCard({ item }: { item: WorkoutItem }) {
  const isCardio = item.type === 'cardio';

  return (
    // VERWIJDERD: 'h-full' uit de className hieronder
    <View className="bg-surface p-4 rounded-xl border border-gray-800 flex-row justify-between items-center">
      <View>
        <Text className="text-white font-bold text-lg">{item.title}</Text>
        
        <Text className="text-gray-400 text-sm mt-1">
          {isCardio ? (
            `${item.distance || 0} km • ${item.duration || 0} min`
          ) : (
            `${item.sets || 0} sets x ${item.reps || 0} reps — ${item.weight || 0} kg`
          )}
        </Text>
        
        <Text className="text-gray-600 text-xs mt-1">{item.date}</Text>
      </View>

      <View className="flex-row items-center">
         {isCardio && (
             <View className="flex-row items-center mr-2 bg-gray-800 px-2 py-1 rounded-lg">
                <Ionicons name="flame" size={12} color="#FF4D4D" />
                <Text className="text-gray-400 text-xs ml-1">{item.calories || 0}</Text>
             </View>
         )}
         <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </View>
  );
}