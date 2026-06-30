import { useEvent } from 'expo';
import { VideoView, type VideoPlayer } from 'expo-video';
import { Pressable, Text, View } from 'react-native';

import { styles } from './video-surface.styles';

interface VideoSurfaceProps {
    player: VideoPlayer;
    className?: string;
}

/** Black rounded video frame with a tap-to-play/pause overlay. */
export function VideoSurface({ player, className }: VideoSurfaceProps) {
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
