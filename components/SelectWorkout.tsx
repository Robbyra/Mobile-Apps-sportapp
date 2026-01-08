import { Modal, FlatList, Text, TouchableOpacity, View } from "react-native";

// 1. We breiden de definitie uit met cardio velden
export type WorkoutItem = {
  id: string;
  title: string;
  type?: 'strength' | 'cardio'; // Nieuw
  sets?: number;
  reps?: number;
  weight?: number; // kg
  distance?: number; // Nieuw
  duration?: number; // Nieuw
  calories?: number; // Nieuw
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
        {/* Header met sluit knop (optioneel, maar wel netjes) */}
        <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold">
            Kies een workout
            </Text>
            <TouchableOpacity onPress={onClose}>
                <Text className="text-primary font-bold">Sluiten</Text>
            </TouchableOpacity>
        </View>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            // Check of het cardio is
            const isCardio = item.type === 'cardio';

            return (
                <TouchableOpacity
                className="bg-surface p-4 rounded-xl mb-3 border border-gray-800"
                onPress={() => onSelect(item)}
                >
                {/* Naam van de workout */}
                <Text className="text-white font-semibold">{item.title}</Text>

                {/* Sets, reps, gewicht OF Afstand, tijd */}
                <Text className="text-gray-400 text-xs mt-1">
                    {isCardio ? (
                        // Cardio weergave
                        `Afstand: ${item.distance || 0} km | Tijd: ${item.duration || 0} min`
                    ) : (
                        // Kracht weergave (default)
                        `Sets: ${item.sets || 0} | Reps: ${item.reps || 0} | Gewicht: ${item.weight || 0} kg`
                    )}
                </Text>
                </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}