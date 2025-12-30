import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <Text className="text-white text-2xl font-bold">Sociaal</Text>
      <Text className="text-primary text-lg mt-2">Welkom bij FitCircle</Text>
    </SafeAreaView>
  );
}