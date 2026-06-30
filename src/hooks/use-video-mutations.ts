import { useMutation } from '@tanstack/react-query';

import { type VideoEntry, type VideoMetadata } from '@/db/schema';
import { useVideoStore } from '@/store/video-store';

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
