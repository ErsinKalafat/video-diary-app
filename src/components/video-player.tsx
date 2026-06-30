import { useVideoPlayer } from 'expo-video';

import { VideoSurface } from '@/components/video-surface';

interface VideoPlayerProps {
    /** Local or remote URI of the clip to play. */
    uri: string;
    /** Start playback automatically when mounted. */
    autoPlay?: boolean;
    /** Loop playback when it reaches the end. */
    loop?: boolean;
    className?: string;
}

/** Plays a clip in a styled frame with a play/pause overlay. */
export function VideoPlayer({
    uri,
    autoPlay = false,
    loop = false,
    className,
}: VideoPlayerProps) {
    const player = useVideoPlayer(uri, (instance) => {
        instance.loop = loop;
        if (autoPlay) {
            instance.play();
        }
    });

    return <VideoSurface player={player} className={className} />;
}
