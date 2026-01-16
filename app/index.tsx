import { BlurView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Map from "../components/Map";
import { useDatabase } from "../context/DatabaseContext";
import { DBMarker } from "../types";


export default function MapScreen() {
  const { getMarkers, addMarker, isLoading, error } = useDatabase();
  const [markers, setMarkers] = React.useState<DBMarker[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const loadMarkers = React.useCallback(async () => {
    if (isLoading) return;
    setRefreshing(true);
    try {
      const data = await getMarkers();
      setMarkers(data);
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось загрузить маркеры из базы данных.");
    } finally {
      setRefreshing(false);
    }
  }, [getMarkers, isLoading]);

  useFocusEffect(
  React.useCallback(() => {
    if (!isLoading && !error) {
      loadMarkers();
    }
  }, [isLoading, error, loadMarkers])
);
  
  // грузим маркеры при открытии экрана
  React.useEffect(() => {
    loadMarkers();
  }, [loadMarkers]);

  // добавление маркера в SQLite
  const handleAddMarker = async (latitude: number, longitude: number) => {
    try {
      await addMarker(latitude, longitude);
      await loadMarkers();
      await loadMarkers();
      Alert.alert("Метка добавлена");
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось добавить метку в базу данных.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Загрузка базы данных…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Ошибка базы данных</Text>
        <Text style={styles.errorText}>{error.message}</Text>
        <Text style={styles.retryText} onPress={loadMarkers}>
          Нажмите, чтобы повторить
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Map
        markers={markers}
        initialRegion={{
          latitude: 58.010259,
          longitude: 56.234195,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onAddMarker={handleAddMarker}
      />

      <BlurView intensity={20} style={styles.hintBox}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Меток на карте: {markers.length}</Text>
        </View>
        <Text style={styles.hintText}>
          Чтобы поставить метку, нажмите и удерживайте
        </Text>

        {/* маленькая “перезагрузка” без кнопки — просто текстом */}
        {refreshing ? (
          <Text style={styles.smallText}>Обновление…</Text>
        ) : (
          <Text style={styles.smallLink} onPress={loadMarkers}>
            Обновить список
          </Text>
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  hintBox: {
    position: "absolute",
    top: 32,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0, 122, 255, 0.5)",
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgb(0, 122, 255)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 12,
    width: "100%",
  },
  badgeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  hintText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },

  smallText: {
    marginTop: 10,
    color: "white",
    opacity: 0.9,
    fontSize: 12,
  },
  smallLink: {
    marginTop: 10,
    color: "white",
    textDecorationLine: "underline",
    fontSize: 12,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: { fontSize: 16, fontWeight: "600" },
  errorTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  errorText: { fontSize: 14, opacity: 0.8, textAlign: "center" },
  retryText: {
    marginTop: 12,
    fontSize: 14,
    textDecorationLine: "underline",
    color: "#2F6FED",
    fontWeight: "700",
  },
});