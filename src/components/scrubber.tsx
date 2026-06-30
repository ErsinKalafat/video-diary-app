import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

interface ScrubberProps {
    /** Total length of the source video, in seconds. */
    durationSec: number;
    /** Length of the (fixed) selection window, in seconds. */
    windowSec: number;
    /** Current window start, in seconds. */
    startSec: number;
    /** Called while the user drags, with the new clamped start in seconds. */
    onChange: (startSec: number) => void;
}

/**
 * A horizontal track representing the whole video, with a draggable highlighted
 * window of fixed length (`windowSec`). Dragging moves the window's start; the
 * end is always `start + windowSec`. The start is clamped so the window stays
 * inside the video. Built on Reanimated + gesture-handler so dragging runs on
 * the UI thread.
 */
export function Scrubber({
    durationSec,
    windowSec,
    startSec,
    onChange,
}: ScrubberProps) {
    const [trackWidth, setTrackWidth] = useState(0);

    // Fraction of the track the window covers, and the furthest it can travel.
    const windowFraction = durationSec > 0 ? Math.min(windowSec / durationSec, 1) : 1;
    const windowWidth = trackWidth * windowFraction;
    const maxTranslate = Math.max(0, trackWidth - windowWidth);
    const maxStartSec = Math.max(0, durationSec - windowSec);

    // Pixel offset of the window from the left edge, driven on the UI thread.
    const translateX = useSharedValue(0);
    const startOffset = useSharedValue(0);

    // Keep the window in sync when start/layout changes from outside a drag.
    if (maxStartSec > 0 && trackWidth > 0) {
        translateX.value = (startSec / maxStartSec) * maxTranslate;
    }

    const pan = Gesture.Pan()
        .onStart(() => {
            startOffset.value = translateX.value;
        })
        .onUpdate((event) => {
            const next = Math.min(
                Math.max(startOffset.value + event.translationX, 0),
                maxTranslate
            );
            translateX.value = next;
            const nextStart = maxTranslate > 0 ? (next / maxTranslate) * maxStartSec : 0;
            runOnJS(onChange)(nextStart);
        });

    const windowStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        width: windowWidth,
    }));

    return (
        <View
            className="h-16 justify-center overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800"
            onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        >
            <GestureDetector gesture={pan}>
                <Animated.View
                    className="absolute top-0 bottom-0 justify-center rounded-xl border-2 border-blue-500 bg-blue-500/25"
                    style={windowStyle}
                >
                    <View className="absolute bottom-2 top-2 left-0.5 w-1.5 rounded-full bg-blue-500" />
                    <View className="absolute bottom-2 top-2 right-0.5 w-1.5 rounded-full bg-blue-500" />
                </Animated.View>
            </GestureDetector>
        </View>
    );
}
