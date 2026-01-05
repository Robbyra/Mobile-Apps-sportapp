import { useRouter } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function DashboardScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <ScrollView className="p-4">
        
        {/* --- HEADER --- */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">FitCircle</Text>
            <Text className="text-gray-400 text-sm">Workout · Voeding · Sociaal</Text>
          </View>
          <View className="flex-row space-x-2 gap-2">
            <TouchableOpacity className="bg-surface px-4 py-2 rounded-lg border border-gray-800" onPress={() => router.push('/profile')}>
              <Text className="text-white font-semibold">Profiel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- VANDAAG KAART --- */}
        <View className="bg-surface p-5 rounded-2xl mb-4 border border-gray-800">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-white text-xl font-bold">Vandaag</Text>
              <Text className="text-gray-400 text-sm">Je dagelijkse voortgang</Text>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between items-end">
            <View className="flex-1 mr-4">
              <Text className="text-gray-300 mb-2">Calorieëndoel</Text>
              <View className="h-2 bg-gray-700 rounded-full w-full">
                <View className="h-2 bg-primary w-[75%] rounded-full" />
              </View>
              <Text className="text-gray-400 text-xs mt-2">1.850 / 2.500 kcal</Text>
            </View>
            <View className="items-end">
               <Text className="text-gray-400 text-xs mb-1">Resterend</Text>
               <Text className="text-white text-2xl font-bold">650</Text>
               <Text className="text-gray-400 text-xs">kcal</Text>
            </View>
          </View>
        </View>

        {/* --- SNELLE ACTIES --- */}
        <View className="bg-surface p-5 rounded-2xl mb-4 border border-gray-800">
          <Text className="text-white text-lg font-bold mb-4">Snelle acties</Text>
          
          <View className="flex-row flex-wrap gap-3">

            <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl"
            onPress={() => router.push('/add-workout')}>
              <Text className="text-white font-bold">Activiteit loggen</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-background border border-gray-700 px-6 py-3 rounded-xl">
              <Text className="text-white font-semibold">Voeding toevoegen</Text>
            </TouchableOpacity>

             <TouchableOpacity className="bg-background border border-gray-700 px-6 py-3 rounded-xl w-full items-center mt-2">
              <Text className="text-white font-semibold">Bekijk feed</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- RECENTE WORKOUTS --- */}
        <View className="bg-surface p-5 rounded-2xl mb-20 border border-gray-800">
          <Text className="text-white text-lg font-bold mb-4">Recente activiteiten</Text>

          {/* ITEM 1: RENNEN */}
          <TouchableOpacity 
            className="bg-background p-4 rounded-xl mb-3 flex-row justify-between items-center"
            onPress={() => router.push('/workout/1')} // <--- DIT IS DE LINK
          >
            <View>
              <Text className="text-white font-bold text-lg">Rennen</Text>
              <Text className="text-gray-400">5,1 km — 28 min</Text>
            </View>
            <Text className="text-gray-300 font-semibold">+320 kcal</Text>
          </TouchableOpacity>

          {/* ITEM 2: KRACHT*/}
          <View className="bg-background p-4 rounded-xl flex-row justify-between items-center">
            <View>
              <Text className="text-white font-bold text-lg">Kracht (volluit)</Text>
              <Text className="text-gray-400">45 min — Benen</Text>
            </View>
            <Text className="text-gray-300 font-semibold">+460 kcal</Text>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}