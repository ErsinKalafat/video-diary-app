import * as SQLite from 'expo-sqlite';

import { type VideoEntry, type VideoMetadata } from './schema';

const DATABASE_NAME = 'video-diary.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Lazily opens (and memoizes) the database connection and runs migrations.
 * All query helpers below go through this so the schema is guaranteed to exist.
 */
function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!databasePromise) {
        databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
            await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS videos (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          uri TEXT NOT NULL,
          thumbnailUri TEXT,
          durationMs INTEGER NOT NULL DEFAULT 0,
          createdAt INTEGER NOT NULL
        );
      `);
            return db;
        });
    }
    return databasePromise;
}

export async function listVideos(): Promise<VideoEntry[]> {
    const db = await getDatabase();
    return db.getAllAsync<VideoEntry>('SELECT * FROM videos ORDER BY createdAt DESC;');
}

export async function getVideo(id: string): Promise<VideoEntry | null> {
    const db = await getDatabase();
    return db.getFirstAsync<VideoEntry>('SELECT * FROM videos WHERE id = ?;', id);
}

export async function insertVideo(entry: VideoEntry): Promise<VideoEntry> {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO videos (id, title, description, uri, thumbnailUri, durationMs, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
        entry.id,
        entry.title,
        entry.description,
        entry.uri,
        entry.thumbnailUri,
        entry.durationMs,
        entry.createdAt
    );
    return entry;
}

export async function updateVideoMetadata(
    id: string,
    metadata: VideoMetadata
): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        'UPDATE videos SET title = ?, description = ? WHERE id = ?;',
        metadata.title,
        metadata.description,
        id
    );
}

export async function deleteVideo(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM videos WHERE id = ?;', id);
}
