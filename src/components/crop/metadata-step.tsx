import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { MetadataForm } from '@/components/metadata-form';
import { type VideoMetadata } from '@/db/schema';

interface MetadataStepProps {
    isSubmitting: boolean;
    onSubmit: (metadata: VideoMetadata) => void;
    onBack: () => void;
}

/** Step 3: name the clip while it is cropped and saved. */
export function MetadataStep({ isSubmitting, onSubmit, onBack }: MetadataStepProps) {
    if (isSubmitting) {
        return (
            <View className="items-center gap-3 py-10">
                <ActivityIndicator size="large" color="#d946ef" />
                <Text className="text-base text-white/70">
                    Cropping your video…
                </Text>
            </View>
        );
    }

    return (
        <View className="gap-4">
            <MetadataForm submitLabel="Save clip" onSubmit={onSubmit} />
            <Pressable className="items-center py-2" onPress={onBack}>
                <Text className="text-base font-medium text-white/70">
                    Back to trimming
                </Text>
            </Pressable>
        </View>
    );
}
