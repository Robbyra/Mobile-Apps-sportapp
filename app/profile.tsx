import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header met terugknop */}
      <View className="px-4 py-2 mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FF4D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {/* Avatar & Naam */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-surface rounded-full items-center justify-center border-2 border-primary mb-4">
             <Text className="text-white text-4xl font-bold">J</Text>
          </View>
          <Text className="text-white text-2xl font-bold">Jouw Naam</Text>
          <Text className="text-gray-400">Lid sinds 2024</Text>
        </View>

        {/* Statistieken Blokje */}
        <View className="flex-row justify-between bg-surface p-6 rounded-2xl border border-gray-800 mb-6">
          <View className="items-center">
            <Text className="text-white text-xl font-bold">12</Text>
            <Text className="text-gray-400 text-xs">Workouts</Text>
          </View>
          <View className="w-px bg-gray-700" />
          <View className="items-center">
            <Text className="text-white text-xl font-bold">480</Text>
            <Text className="text-gray-400 text-xs">Minuten</Text>
          </View>
          <View className="w-px bg-gray-700" />
          <View className="items-center">
            <Text className="text-white text-xl font-bold">5</Text>
            <Text className="text-gray-400 text-xs">Vrienden</Text>
          </View>
        </View>

        {/* Instellingen Lijstje */}
        <View className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-800">
            <Ionicons name="settings-outline" size={22} color="white" />
            <Text className="text-white ml-3 font-semibold flex-1">Instellingen</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-800">
            <Ionicons name="notifications-outline" size={22} color="white" />
            <Text className="text-white ml-3 font-semibold flex-1">Meldingen</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4">
            <Ionicons name="log-out-outline" size={22} color="#FF4D4D" />
            <Text className="text-primary ml-3 font-semibold flex-1">Uitloggen</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}