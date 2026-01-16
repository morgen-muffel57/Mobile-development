import * as SQLite from "expo-sqlite";

const DB_NAME = "markers.db";

// инициализация базы данных
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    
    // открываем файл markers.db, если нет, созда м новый
    const db = await SQLite.openDatabaseAsync(DB_NAME);

    // включаем foreign keys, иначе ON DELETE CASCADE может не работать
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // создаём таблицы markers и marker_images
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS markers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS marker_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marker_id INTEGER NOT NULL,
        uri TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
      );
    `);

    return db;
  } catch (error) {
    console.error("Ошибка инициализации базы данных:", error);
    throw error;
  }
};
