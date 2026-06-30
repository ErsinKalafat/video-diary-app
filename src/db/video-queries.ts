import { getDatabase } from './database';
import { type VideoEntry, type VideoMetadata } from './schema';

/** Columns aliased back to the camelCase shape used across the app. */
const SELECT_COLUMNS = `
  id,
  name,
  description,
  original_uri AS originalUri,
  cropped_uri AS croppedUri,
  created_at AS createdAt
`;

/** Fetch every diary entry, newest first. */
export async function listVideos(): Promise<VideoEntry[]> {
    const db = await getDatabase();
    return db.getAllAsync<VideoEntry>(
        `SELECT ${SELECT_COLUMNS} FROM videos ORDER BY created_at DESC;`
    );
}

/** Fetch a single diary entry by id, or null when it does not exist. */
export async function getVideo(id: string): Promise<VideoEntry | null> {
    const db = await getDatabase();
    return db.getFirstAsync<VideoEntry>(
        `SELECT ${SELECT_COLUMNS} FROM videos WHERE id = ?;`,
        id
    );
}

/** Persist a freshly cropped clip and return the stored entry. */
export async function insertVideo(entry: VideoEntry): Promise<VideoEntry> {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO videos (id, name, description, original_uri, cropped_uri, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
        entry.id,
        entry.name,
        entry.description,
        entry.originalUri,
        entry.croppedUri,
        entry.createdAt
    );
    return entry;
}

/** Update the name/description of an existing entry. */
export async function updateVideoMetadata(
    id: string,
    metadata: VideoMetadata
): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        'UPDATE videos SET name = ?, description = ? WHERE id = ?;',
        metadata.name,
        metadata.description,
        id
    );
}

/** Remove an entry by id. */
export async function deleteVideo(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM videos WHERE id = ?;', id);
}
