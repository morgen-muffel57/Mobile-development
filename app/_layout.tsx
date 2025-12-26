import { Stack } from "expo-router";
import { MarkerProvider } from "../context/MarkerContext";

export default function RootLayout() {
  return (
    <MarkerProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="marker/[id]"
          options={{
            headerTitle: "Информация о метке",
            headerBackTitle: "Назад",
          }}
        />
      </Stack>
    </MarkerProvider>
  );
}
