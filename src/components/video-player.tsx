import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, Text, View } from 'react-native';

interface VideoPlayerProps {
    /** Local or remote URI of the clip to play. */
    uri: string;
    /** Start playback automatically when mounted. */
    autoPlay?: boolean;
    /** Loop playback when it reaches the end. */
    loop?: boolean;
    className?: string;
}

/**
 * Thin wrapper around expo-video that exposes a styled player with a
 * play/pause overlay. Used by the crop preview and the entry detail screen.
 */
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

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });

    return (
        <View className={`overflow-hidden rounded-2xl bg-black ${className ?? ''}`}>
            <VideoView
                player={player}
                className="w-full aspect-video"
                contentFit="contain"
                nativeControls={false}
            />
            <Pressable
                className="absolute inset-0 items-center justify-center"
                onPress={() => (isPlaying ? player.pause() : player.play())}
            >
                {!isPlaying && (
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-white/80">
                        <Text className="text-2xl text-black">▶</Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
}
