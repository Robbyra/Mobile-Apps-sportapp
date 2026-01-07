import { Modal, FlatList, Text, TouchableOpacity, View } from 'react-native';

export type WorkoutItem = {
  id: string;
  title: string;
  sets: number;
  reps: number;
  weight: number; // kg
  date: string;
};

type Props = {
  visible: boolean;
  workouts: WorkoutItem[];
  onClose: () => void;
  onSelect: (workout: WorkoutItem) => void;
};

export default function SelectWorkoutModal({
  visible,
  workouts,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-background p-4">
        <Text className="text-white text-xl font-bold mb-4">
          Kies een workout
        </Text>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            
            <TouchableOpacity
              className="bg-surface p-4 rounded-xl mb-3 border border-gray-800"
              onPress={() => onSelect(item)}
            >
              {/* Naam van de workout */}
              <Text className="text-white font-semibold">{item.title}</Text>
              
              {/* Sets, reps, gewicht */}
              <Text className="text-gray-400 text-xs">
                Sets: {item.sets} | Reps: {item.reps} | Gewicht: {item.weight} kg
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}
