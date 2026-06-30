import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { MetadataForm } from '@/components/metadata-form';
import { Message } from '@/components/ui/message';
import { ScreenBackground } from '@/components/ui/screen-background';
import { type VideoMetadata } from '@/db/schema';
import { useVideoById } from '@/hooks/use-video';
import { useEditVideo } from '@/hooks/use-video-mutations';

/** Edit page: update the name/description of an existing clip. */
export default function EditScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const video = useVideoById(id);
    const editVideo = useEditVideo();

    if (!video) {
        return (
            <ScreenBackground>
                <Message text="Video not found." />
            </ScreenBackground>
        );
    }

    const save = (metadata: VideoMetadata) => {
        editVideo.mutate(
            { id: video.id, metadata },
            {
                onSuccess: () => router.back(),
                onError: (error) =>
                    Alert.alert(
                        'Could not save',
                        error instanceof Error ? error.message : 'Please try again.'
                    ),
            }
        );
    };

    return (
        <ScreenBackground>
            <View className="flex-1 p-5">
                <MetadataForm
                    defaultValues={{ name: video.name, description: video.description }}
                    submitLabel="Save changes"
                    isSubmitting={editVideo.isPending}
                    onSubmit={save}
                />
            </View>
        </ScreenBackground>
    );
}
