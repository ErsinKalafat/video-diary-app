import { type VideoEntry } from '@/db/schema';
import { useVideoStore } from '@/store/video-store';

/** Find a single saved clip by id from the store. */
export function useVideoById(id: string | undefined): VideoEntry | undefined {
    return useVideoStore((state) => state.videos.find((video) => video.id === id));
}
