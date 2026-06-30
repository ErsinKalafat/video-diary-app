import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { type VideoEntry } from '@/db/schema';

interface VideoListItemProps {
    video: VideoEntry;
    onPress: () => void;
    onDelete: () => void;
}

/** A single row in the home list: play icon, name, description and a delete button. */
export function VideoListItem({ video, onPress, onDelete }: VideoListItemProps) {
    return (
        <Animated.View entering={FadeInDown} layout={LinearTransition.springify()}>
            <Pressable
                className="flex-row items-center gap-3 rounded-2xl bg-gray-100 p-3 active:opacity-80 dark:bg-gray-800"
                onPress={onPress}
            >
                <View className="h-14 w-14 items-center justify-center rounded-xl bg-blue-600">
                    <Text className="text-xl text-white">▶</Text>
                </View>
                <View className="flex-1">
                    <Text
                        numberOfLines={1}
                        className="text-base font-semibold text-gray-900 dark:text-white"
                    >
                        {video.name}
                    </Text>
                    {video.description ? (
                        <Text
                            numberOfLines={1}
                            className="text-sm text-gray-500 dark:text-gray-400"
                        >
                            {video.description}
                        </Text>
                    ) : null}
                </View>
                <Pressable
                    className="h-9 w-9 items-center justify-center rounded-full active:opacity-60"
                    hitSlop={8}
                    onPress={onDelete}
                >
                    <Text className="text-lg">🗑️</Text>
                </Pressable>
            </Pressable>
        </Animated.View>
    );
}
