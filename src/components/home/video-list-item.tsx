import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { VideoThumbnail } from '@/components/home/video-thumbnail';
import { type VideoEntry } from '@/db/schema';

interface VideoListItemProps {
    video: VideoEntry;
    onPress: () => void;
    onDelete: () => void;
}

/** A glassy row: clip thumbnail, name, description and a delete button. */
export function VideoListItem({ video, onPress, onDelete }: VideoListItemProps) {
    return (
        <Animated.View entering={FadeInDown} layout={LinearTransition.springify()}>
            <Pressable
                className="flex-row items-center gap-3 rounded-3xl border border-white/15 bg-white/10 p-3 active:bg-white/20"
                onPress={onPress}
            >
                <VideoThumbnail uri={video.croppedUri} />
                <View className="flex-1">
                    <Text numberOfLines={1} className="text-base font-semibold text-white">
                        {video.name}
                    </Text>
                    {video.description ? (
                        <Text numberOfLines={1} className="text-sm text-white/60">
                            {video.description}
                        </Text>
                    ) : null}
                </View>
                <Pressable
                    className="h-9 w-9 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
                    hitSlop={8}
                    onPress={onDelete}
                >
                    <Text className="text-base">🗑️</Text>
                </Pressable>
            </Pressable>
        </Animated.View>
    );
}
