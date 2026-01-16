import * as SQLite from "expo-sqlite";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addImage as opAddImage,
  addMarker as opAddMarker,
  deleteImage as opDeleteImage,
  deleteMarker as opDeleteMarker,
  getMarkerById as opGetMarkerById,
  getMarkerImages as opGetMarkerImages,
  getMarkers as opGetMarkers,
} from "../database/operations";
import { initDatabase } from "../database/schema";
import { DatabaseContextType } from "../types";

// создаём контекст
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // инициализация базы при запуске приложения
  useEffect(() => {
    let isMounted = true;

    // создаём функцию boot, которая будет запускать инициализацию
    const boot = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const database = await initDatabase();
        if (isMounted) setDb(database);
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(String(e));
        console.error("Database init failed:", err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    boot();

    return () => {
      // флаг isMounted защищает от setState после размонтирования
      isMounted = false;
    };
  }, []); // useEffect выполняем только при первом запуске компонента

  // методы, которые используют operations.ts 
  // функция для добавления маркера в базу данных
  const addMarker = async (latitude: number, longitude: number) => {
    if (!db) throw new Error("DB is not ready");
    try {
      return await opAddMarker(db, latitude, longitude);
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    }
  };

  // функция для удаления маркера из базы данных 
  const deleteMarker = async (id: number) => {
    if (!db) throw new Error("DB is not ready");
    try {
      await opDeleteMarker(db, id);
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    }
  };

  // функция для получения параметров из базы данных
  const getMarkers = async () => {
    if (!db) throw new Error("DB is not ready");
    try {
      return await opGetMarkers(db);
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    }
  };

  // функция добавления фото к маркеру
  const addImage = async (markerId: number, uri: string) => {
    if (!db) throw new Error("DB is not ready");
    try {
      await opAddImage(db, markerId, uri);
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    }
  };

  // функция для удаления фото
  const deleteImage = async (id: number) => {
    if (!db) throw new Error("DB is not ready");
    try {
      await opDeleteImage(db, id);
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    }
  };

  // функция для получения фото метки
  const getMarkerImages = async (markerId: number) => {
    if (!db) throw new Error("DB is not ready");
    try {
      return await opGetMarkerImages(db, markerId);
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    }
  };

  // функция для получения маркера по его id
  const getMarkerById = async (id: number) => {
  if (!db) throw new Error("DB is not ready");
  try {
    return await opGetMarkerById(db, id);
  } catch (e: any) {
    const err = e instanceof Error ? e : new Error(String(e));
    setError(err);
    throw err;
  }
};

  // собираем все функции и состояния базы данных в один объект, передаёт его через контекст всему приложению
  const value = useMemo<DatabaseContextType>(
    () => ({
      addMarker,
      deleteMarker,
      getMarkers,
      addImage,
      deleteImage,
      getMarkerImages,
      getMarkerById,
      isLoading,
      error,
    }),
    [db, isLoading, error]
  );

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error("useDatabase must be used within a DatabaseProvider");
  return ctx;
};
