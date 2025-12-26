import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MarkerContextType, MarkerData } from "../types";

const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

const STORAGE_KEY = "@my_map_markers";

export const MarkerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // загрузка - срабатывает один раз при запуске приложения
  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const savedMarkers = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMarkers) {
          setMarkers(JSON.parse(savedMarkers));
        }
      } catch (e) {
        console.error("Ошибка загрузки:", e);
      }
    };
    loadMarkers();
  }, []);

  // сохранение - срабатывает каждый раз, когда меняется массив markers
  useEffect(() => {
    const saveMarkers = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
      } catch (e) {
        console.error("Ошибка сохранения:", e);
      }
    };
    saveMarkers();
  }, [markers]);

  const addMarker = (newMarker: MarkerData) => {
    setMarkers((prev) => [...prev, newMarker]);
  };

  const deleteMarker = (markerId: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
  };

  const addPhotoToMarker = (markerId: string, photo: any) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === markerId ? { ...m, images: [...m.images, photo] } : m
      )
    );
  };

  const deletePhotoFromMarker = (markerId: string, photoId: string) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === markerId
          ? { ...m, images: m.images.filter((img) => img.id !== photoId) }
          : m
      )
    );
  };

  return (
    <MarkerContext.Provider
      value={{
        markers,
        addMarker,
        deleteMarker,
        addPhotoToMarker,
        deletePhotoFromMarker,
      }}
    >
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkers = () => {
  const context = useContext(MarkerContext);
  if (!context)
    throw new Error("useMarkers must be used within a MarkerProvider");
  return context;
};
