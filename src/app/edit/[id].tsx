import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { MetadataForm } from '@/components/metadata-form';
import { NotFound } from '@/components/ui/not-found';
import { ScreenBackground } from '@/components/ui/screen-background';
import { type VideoMetadata } from '@/db/schema';
import { alertError } from '@/lib/errors';
import { useVideoById } from '@/hooks/use-video';
import { useEditVideo } from '@/hooks/use-video-mutations';

/** Edit page: update the name/description of an existing clip. */
export default function EditScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const video = useVideoById(id);
    const editVideo = useEditVideo();

    if (!video) {
        return <NotFound />;
    }

    const save = (metadata: VideoMetadata) => {
        editVideo.mutate(
            { id: video.id, metadata },
            {
                onSuccess: () => router.back(),
                onError: (error) => alertError('Could not save', error),
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
