import { create } from 'zustand';

import {
    deleteVideo,
    insertVideo,
    listVideos,
    updateVideoMetadata,
} from '@/db';
import { type VideoEntry, type VideoMetadata } from '@/db/schema';
import { toErrorMessage } from '@/lib/errors';
import { deleteVideoFile } from '@/lib/video-files';

interface VideoState {
    /** The persisted diary entries, newest first. Mirrors the SQLite table. */
    videos: VideoEntry[];
    isLoading: boolean;
    error: string | null;

    /** Load all entries from SQLite into the store. */
    loadVideos: () => Promise<void>;
    /** Persist a new entry, then prepend it to the list optimistically. */
    addVideo: (entry: VideoEntry) => Promise<void>;
    /** Update an entry's metadata in SQLite and in the store. */
    editVideo: (id: string, metadata: VideoMetadata) => Promise<void>;
    /** Delete an entry from SQLite and from the store. */
    removeVideo: (id: string) => Promise<void>;
}

/**
 * In-memory mirror of the SQLite `videos` table (source of truth on disk).
 * Mutations update the list optimistically and roll back if the DB call fails.
 */
export const useVideoStore = create<VideoState>((set, get) => ({
    videos: [],
    isLoading: false,
    error: null,

    loadVideos: async () => {
        set({ isLoading: true, error: null });
        try {
            const videos = await listVideos();
            set({ videos, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: toErrorMessage(error) });
        }
    },

    addVideo: async (entry) => {
        const previous = get().videos;
        set({ videos: [entry, ...previous], error: null });
        try {
            await insertVideo(entry);
        } catch (error) {
            set({ videos: previous, error: toErrorMessage(error) });
            throw error;
        }
    },

    editVideo: async (id, metadata) => {
        const previous = get().videos;
        set({
            videos: previous.map((video) =>
                video.id === id ? { ...video, ...metadata } : video
            ),
            error: null,
        });
        try {
            await updateVideoMetadata(id, metadata);
        } catch (error) {
            set({ videos: previous, error: toErrorMessage(error) });
            throw error;
        }
    },

    removeVideo: async (id) => {
        const previous = get().videos;
        const removed = previous.find((video) => video.id === id);
        set({ videos: previous.filter((video) => video.id !== id), error: null });
        try {
            await deleteVideo(id);
            if (removed) {
                deleteVideoFile(removed.croppedUri);
            }
        } catch (error) {
            set({ videos: previous, error: toErrorMessage(error) });
            throw error;
        }
    },
}));
