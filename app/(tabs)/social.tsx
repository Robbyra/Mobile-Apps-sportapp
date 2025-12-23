import { View, Text, SafeAreaView } from 'react-native';

export default function DashboardScreen() {
  return (
    // bg-background is defined in your tailwind.config.js as #0F0F0F
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <Text className="text-white text-2xl font-bold">Sociaal</Text>
      <Text className="text-primary text-lg mt-2">Welkom bij FitCircle</Text>
    </SafeAreaView>
  );
}