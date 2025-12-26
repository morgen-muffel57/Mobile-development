//Задача: рисует маркеры и обрабатывает переход по облачку.
//Вынеси туда весь markers.map(...) из index.tsx.

import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { MarkerData } from "../types";

type Props = {
  markers: MarkerData[];
};

export default function MarkerList({ markers }: Props) {
  const router = useRouter();

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          description={"Нажмите, чтобы открыть информацию о метке"}
          onCalloutPress={() => router.push(`/marker/${marker.id}`)}
        >
          <View style={styles.markerWrapper}>
            <FontAwesome5 name="paw" size={24} color="#007AFF" />
          </View>
        </Marker>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
});
