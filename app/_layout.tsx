import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: "#0F0F0F" }
      }} />
    </View>
  );
}