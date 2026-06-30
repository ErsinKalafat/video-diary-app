import { useEventListener } from 'expo';
import { useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';

import { VideoSurface } from '@/components/video-surface';

interface CropPreviewProps {
    /** URI of the source video. */
    uri: string;
    /** Start of the selected window, in seconds. */
    startSec: number;
    /** Length of the window, in seconds. */
    windowSec: number;
}

/**
 * Plays only the selected window of the source video, looping back to the start
 * when it reaches the end, so the user can preview exactly what will be cropped.
 * Seeks live as the window start changes (e.g. while dragging the scrubber).
 */
export function CropPreview({ uri, startSec, windowSec }: CropPreviewProps) {
    const endSec = startSec + windowSec;

    const player = useVideoPlayer(uri, (instance) => {
        instance.timeUpdateEventInterval = 0.2;
        instance.currentTime = startSec;
    });

    // Seek to the new start whenever the selected window moves.
    useEffect(() => {
        player.currentTime = startSec;
    }, [player, startSec]);

    // Keep playback inside the selected window.
    useEventListener(player, 'timeUpdate', ({ currentTime }) => {
        if (currentTime >= endSec || currentTime < startSec - 0.2) {
            player.currentTime = startSec;
        }
    });

    return <VideoSurface player={player} />;
}
