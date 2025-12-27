import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MarkerContextType, MarkerData } from "../types";

// создаём контекст
const MarkerContext = createContext<MarkerContextType | undefined>(undefined);
// подключаем AsyncStorage для хранения данных на телефоне, чтобы при закрытии приложения метки сохранялись
const STORAGE_KEY = "@my_map_markers";

export const MarkerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // загрузка - срабатывает один раз при запуске приложения
  useEffect(() => {
    // ассионхронная функция, выполняется не сразу
    const loadMarkers = async () => {
      try {
        const savedMarkers = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMarkers) {
          //JSON.parse — превращаем строку в массив объектов
          setMarkers(JSON.parse(savedMarkers));
        }
      } catch (e) {
        console.error("Ошибка загрузки:", e);
      }
    };
    loadMarkers();
    //[] — массив зависимостей
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

  // добавление маркера
  const addMarker = (newMarker: MarkerData) => {
    setMarkers((prev) => [...prev, newMarker]);
  };

  // удаление маркера
  const deleteMarker = (markerId: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
  };

  // добавление фото
  const addPhotoToMarker = (markerId: string, photo: any) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === markerId ? { ...m, images: [...m.images, photo] } : m
      )
    );
  };

  // удаление фото из маркера
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

// хук для доступа из любой части приложения
export const useMarkers = () => {
  const context = useContext(MarkerContext);
  if (!context)
    throw new Error("useMarkers must be used within a MarkerProvider");
  return context;
};
