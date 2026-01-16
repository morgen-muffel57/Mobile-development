import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Region } from "react-native-maps";
import { DBMarker } from "../types";
import MarkerList from "./MarkerList";

type Props = {
  markers: DBMarker[];
  initialRegion: Region;
  onAddMarker: (lat: number, lng: number) => void;
};

export default function Map({ markers, initialRegion, onAddMarker }: Props) {
  // обработчик долгого нажатия на карту
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
