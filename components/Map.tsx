// Задача: карта + long press + onMapReady.
// Событие добавления маркера передаём пропсом onAddMarker(lat, lng).

import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Region } from "react-native-maps";
import { MarkerData } from "../types";
import MarkerList from "./MarkerList";

type Props = {
  markers: MarkerData[];
  initialRegion: Region;
  onAddMarker: (lat: number, lng: number) => void;
};

export default function Map({ markers, initialRegion, onAddMarker }: Props) {
  const handleLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onAddMarker(latitude, longitude);
  };

  return (
    <MapView
      style={styles.map}
      onLongPress={handleLongPress}
      initialRegion={initialRegion}
    >
      <MarkerList markers={markers} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", height: "100%" },
});
