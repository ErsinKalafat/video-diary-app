import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, Text, View } from 'react-native';

import { styles } from './video-player.styles';

interface VideoPlayerProps {
    /** Local or remote URI of the clip to play. */
    uri: string;
    /** Start playback automatically when mounted. */
    autoPlay?: boolean;
    /** Loop playback when it reaches the end. */
    loop?: boolean;
    className?: string;
}

/** expo-video wrapper with a styled frame and a play/pause overlay. */
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
                style={styles.video}
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
