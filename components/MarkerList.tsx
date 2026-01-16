import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { DBMarker } from "../types";

type Props = {
  markers: DBMarker[];
};

export default function MarkerList({ markers }: Props) {
  const router = useRouter();

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={`Метка ${marker.id}`}
          description={"Нажмите, чтобы открыть информацию о метке"}
          onCalloutPress={() => router.push(`/marker/${marker.id}`)}
        >
          {/* Иконка */}
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
  callout: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
