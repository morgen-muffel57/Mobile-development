import { BlurView } from "expo-blur";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Map from "../components/Map";
import { useMarkers } from "../context/MarkerContext";
import { MarkerData } from "../types";

export default function MapScreen() {
  // получаем данные из контекста с помощью хука useMarkers
  const { markers, addMarker } = useMarkers();

  // функция добавления маркера
  const handleAddMarker = (latitude: number, longitude: number) => {
    const nextNumber = markers.length + 1;

    // создаём объект новго маркера
    const newMarker: MarkerData = {
      id: Date.now().toString(),
      latitude,
      longitude,
      title: `Метка ${nextNumber}`,
      description: `Описание метки ${nextNumber}`,
      images: [],
    };

    // добавляем маркер в контекст
    addMarker(newMarker);
    Alert.alert("Метка добавлена");
  };

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
});
