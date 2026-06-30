import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './crop-preview.styles';

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

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });

    return (
        <View className="overflow-hidden rounded-2xl bg-black">
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
