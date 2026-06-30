import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    deleteVideo,
    getVideo,
    insertVideo,
    listVideos,
    updateVideoMetadata,
} from '@/db';
import { type VideoEntry, type VideoMetadata } from '@/db/schema';

export const videoKeys = {
    all: ['videos'] as const,
    detail: (id: string) => ['videos', id] as const,
};

/** Fetch every diary entry, newest first. */
export function useVideos() {
    return useQuery({
        queryKey: videoKeys.all,
        queryFn: listVideos,
    });
}

/** Fetch a single diary entry by id. */
export function useVideo(id: string) {
    return useQuery({
        queryKey: videoKeys.detail(id),
        queryFn: () => getVideo(id),
        enabled: Boolean(id),
    });
}

/** Persist a freshly cropped clip and refresh the list. */
export function useAddVideo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (entry: VideoEntry) => insertVideo(entry),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: videoKeys.all });
        },
    });
}

/** Update the title/description of an existing entry. */
export function useUpdateVideoMetadata(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (metadata: VideoMetadata) => updateVideoMetadata(id, metadata),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: videoKeys.all });
            queryClient.invalidateQueries({ queryKey: videoKeys.detail(id) });
        },
    });
}

/** Remove an entry and refresh the list. */
export function useDeleteVideo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteVideo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: videoKeys.all });
        },
    });
}
