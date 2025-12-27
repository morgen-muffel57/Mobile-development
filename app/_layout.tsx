import { Stack } from "expo-router";
import { MarkerProvider } from "../context/MarkerContext";

export default function RootLayout() {
  return (
    // объявляем экраны для стековой навигации
    // оборачиваем всё в провайдер, чтобы у любого экрана был доступ к контексту (а именно функции useMarkers())
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
