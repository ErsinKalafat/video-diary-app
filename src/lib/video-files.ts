import { File } from 'expo-file-system';

/**
 * Delete a cropped clip from disk so removed entries don't leave files behind.
 * Best-effort: a missing or already-deleted file is ignored.
 */
export function deleteVideoFile(uri: string): void {
    try {
        const file = new File(uri);
        if (file.exists) {
            file.delete();
        }
    } catch {
        // Ignore: cleanup failures must not break the remove flow.
    }
}
