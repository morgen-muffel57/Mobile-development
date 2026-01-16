import * as SQLite from "expo-sqlite";
import { DBMarker, DBMarkerImage } from "../types";

// получаем список маркеров
// используем Promise, т.к. запрос ассинхронный (выполняется без блокировки остального кода)
export const getMarkers = async (
  // db - подключение к базе
  db: SQLite.SQLiteDatabase,
): Promise<DBMarker[]> => {
  try {
    const rows = await db.getAllAsync<DBMarker>(
      `SELECT id, latitude, longitude, created_at
       FROM markers
       ORDER BY created_at DESC;`,
    );
    return rows;
  } catch (error) {
    console.error("Ошибка получения маркеров:", error);
    throw error;
  }
};

// добавляем маркер. возвращает id нового маркера
export const addMarker = async (
  db: SQLite.SQLiteDatabase,
  latitude: number,
  longitude: number,
  // возвращаем Promise<number>, т.к. хотим вернуть id созданного маркера
): Promise<number> => {
  try {
    const result = await db.runAsync(
      `INSERT INTO markers (latitude, longitude) VALUES (?, ?);`,
      [latitude, longitude],
    );

    // result.lastInsertRowId — id созданной строки
    return Number(result.lastInsertRowId);
  } catch (error) {
    console.error("Ошибка добавления маркера:", error);
    throw error;
  }
};

// удаляем маркер (и связанные фото удалятся каскадом при включенных FK)
export const deleteMarker = async (
  db: SQLite.SQLiteDatabase,
  id: number,
): Promise<void> => {
  try {
    await db.runAsync(`DELETE FROM markers WHERE id = ?;`, [id]);
  } catch (error) {
    console.error("Ошибка удаления маркера:", error);
    throw error;
  }
};

// получаем все изображения для конкретного маркера
export const getMarkerImages = async (
  db: SQLite.SQLiteDatabase,
  markerId: number,
): Promise<DBMarkerImage[]> => {
  try {
    const rows = await db.getAllAsync<DBMarkerImage>(
      `SELECT id, marker_id, uri, created_at
       FROM marker_images
       WHERE marker_id = ?
       ORDER BY created_at DESC;`,
      [markerId],
    );
    return rows;
  } catch (error) {
    console.error("Ошибка получения изображений:", error);
    throw error;
  }
};

// добавляем изображение к маркеру
export const addImage = async (
  db: SQLite.SQLiteDatabase,
  markerId: number,
  uri: string, // uri — путь к файлу изображения на устройстве (Expo ImagePicker отдаёт uri)
): Promise<void> => {
  try {
    await db.runAsync(
      `INSERT INTO marker_images (marker_id, uri) VALUES (?, ?);`,
      [markerId, uri],
    );
  } catch (error) {
    console.error("Ошибка добавления изображения:", error);
    throw error;
  }
};

// удаляем изображение по id
export const deleteImage = async (
  db: SQLite.SQLiteDatabase,
  id: number, // id записи в marker_images
): Promise<void> => {
  try {
    await db.runAsync(`DELETE FROM marker_images WHERE id = ?;`, [id]);
  } catch (error) {
    console.error("Ошибка удаления изображения:", error);
    throw error;
  }
};

// получаем маркер по id (одна метка)
export const getMarkerById = async (
  db: SQLite.SQLiteDatabase,
  id: number,
): Promise<DBMarker | null> => {
  try {
    // getFirstAsync<T> делает SELECT и возвращает ПЕРВУЮ строку результата
    const row = await db.getFirstAsync<DBMarker>(
      `SELECT id, latitude, longitude, created_at
       FROM markers
       WHERE id = ?;`,
      [id],
    );
    return row ?? null;
  } catch (error) {
    console.error("Ошибка получения маркера:", error);
    throw error;
  }
};
