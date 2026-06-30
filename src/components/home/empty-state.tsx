import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

/** Shown on the home screen when no clips have been saved yet. */
export function EmptyState() {
    return (
        <Animated.View
            entering={FadeInDown.duration(500)}
            className="flex-1 items-center justify-center gap-2 px-8"
        >
            <Text className="text-5xl">🎬</Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                No videos yet
            </Text>
            <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
                Tap “Add video” to crop your first 5-second diary clip.
            </Text>
        </Animated.View>
    );
}
