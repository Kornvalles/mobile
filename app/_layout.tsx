import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ title: "Cases" }} />
        <Stack.Screen name="new" options={{ title: "New Case" }} />
        <Stack.Screen name="case/[id]" options={{ title: "Case" }} />
        <Stack.Screen name="case/[id]/capture" options={{ title: "Capture" }} />
        <Stack.Screen
          name="case/[id]/arrangements"
          options={{ title: "Arrangements" }}
        />
        <Stack.Screen name="case/[id]/publish" options={{ title: "Publish" }} />
      </Stack>
    </SafeAreaView>
  );
}
