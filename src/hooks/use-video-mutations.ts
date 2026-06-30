import { useMutation } from '@tanstack/react-query';
import { trimVideo } from 'expo-trim-video';

import { type VideoEntry, type VideoMetadata } from '@/db/schema';
import { useVideoStore } from '@/store/video-store';

/** Input for cropping a source video and saving the result as a diary entry. */
export interface CreateVideoEntryInput {
    sourceUri: string;
    /** Crop window start, in seconds. */
    startSec: number;
    /** Crop window end, in seconds (must be `startSec + 5`). */
    endSec: number;
    metadata: VideoMetadata;
}

/** Generate a collision-resistant id without an extra dependency. */
function createId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * React Query mutations for the async/persistence operations on diary entries.
 *
 * The list itself lives in the Zustand store (`useVideoStore`) — these hooks
 * only wrap the write operations so screens get loading/error/retry state for
 * potentially slow work (disk writes, and later the video crop). Each mutation
 * delegates to a store action that writes through to SQLite and keeps the
 * in-memory list in sync.
 */

/** Persist a freshly cropped clip. */
export function useAddVideo() {
    const addVideo = useVideoStore((state) => state.addVideo);
    return useMutation({
        mutationFn: (entry: VideoEntry) => addVideo(entry),
    });
}

/**
 * Crop a source video to its selected 5-second window and save the result as a
 * diary entry. The slow native trim runs through React Query so the modal gets
 * loading/error/retry state; on success the store writes through to SQLite.
 */
export function useCreateVideoEntry() {
    const addVideo = useVideoStore((state) => state.addVideo);
    return useMutation({
        mutationFn: async ({
            sourceUri,
            startSec,
            endSec,
            metadata,
        }: CreateVideoEntryInput) => {
            const { uri: croppedUri } = await trimVideo({
                uri: sourceUri,
                start: startSec,
                end: endSec,
            });
            const entry: VideoEntry = {
                id: createId(),
                ...metadata,
                originalUri: sourceUri,
                croppedUri,
                createdAt: Date.now(),
            };
            await addVideo(entry);
            return entry;
        },
    });
}

/** Update the name/description of an existing entry. */
export function useEditVideo() {
    const editVideo = useVideoStore((state) => state.editVideo);
    return useMutation({
        mutationFn: ({ id, metadata }: { id: string; metadata: VideoMetadata }) =>
            editVideo(id, metadata),
    });
}

/** Delete an entry. */
export function useRemoveVideo() {
    const removeVideo = useVideoStore((state) => state.removeVideo);
    return useMutation({
        mutationFn: (id: string) => removeVideo(id),
    });
}
