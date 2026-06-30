import { create } from 'zustand';

import {
    deleteVideo,
    insertVideo,
    listVideos,
    updateVideoMetadata,
} from '@/db';
import { type VideoEntry, type VideoMetadata } from '@/db/schema';

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

function toMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Something went wrong';
}

/**
 * Global store for the persisted video list. SQLite is the source of truth on
 * disk; this store keeps an in-memory mirror so screens can render instantly
 * and update optimistically. Mutations write through to SQLite and roll back
 * the in-memory state if the database call fails.
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
            set({ isLoading: false, error: toMessage(error) });
        }
    },

    addVideo: async (entry) => {
        const previous = get().videos;
        set({ videos: [entry, ...previous], error: null });
        try {
            await insertVideo(entry);
        } catch (error) {
            set({ videos: previous, error: toMessage(error) });
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
            set({ videos: previous, error: toMessage(error) });
            throw error;
        }
    },

    removeVideo: async (id) => {
        const previous = get().videos;
        set({ videos: previous.filter((video) => video.id !== id), error: null });
        try {
            await deleteVideo(id);
        } catch (error) {
            set({ videos: previous, error: toMessage(error) });
            throw error;
        }
    },
}));
