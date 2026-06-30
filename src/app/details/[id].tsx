import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Message } from '@/components/ui/message';
import { ScreenBackground } from '@/components/ui/screen-background';
import { VideoPlayer } from '@/components/video-player';
import { useVideoById } from '@/hooks/use-video';

/** Detail page: the cropped clip on top, its name and description below. */
export default function DetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const video = useVideoById(id);

    if (!video) {
        return (
            <ScreenBackground>
                <Message text="Video not found." />
            </ScreenBackground>
        );
    }

    return (
        <ScreenBackground>
            <ScrollView contentContainerClassName="gap-5 p-5">
                <VideoPlayer uri={video.croppedUri} autoPlay loop />
                <View className="gap-2">
                    <Text className="text-2xl font-bold text-white">{video.name}</Text>
                    {video.description ? (
                        <Text className="text-base text-white/70">
                            {video.description}
                        </Text>
                    ) : null}
                </View>
                <Button
                    label="Edit details"
                    onPress={() =>
                        router.push({ pathname: '/edit/[id]', params: { id: video.id } })
                    }
                />
            </ScrollView>
        </ScreenBackground>
    );
}
