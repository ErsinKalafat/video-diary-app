import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'video-diary.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Lazily opens and memoizes the connection, creating the `videos` table on
 * first access so every query can assume it exists.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!databasePromise) {
        databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
            await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS videos (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          original_uri TEXT NOT NULL,
          cropped_uri TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );
      `);
            return db;
        });
    }
    return databasePromise;
}
