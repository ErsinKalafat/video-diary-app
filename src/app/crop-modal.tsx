import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CropStep } from '@/components/crop/crop-step';
import { MetadataStep } from '@/components/crop/metadata-step';
import { SelectStep } from '@/components/crop/select-step';
import { type VideoMetadata } from '@/db/schema';
import { useCreateVideoEntry } from '@/hooks/use-video-mutations';
import {
    CROP_DURATION_SEC,
    useVideoEditorStore,
} from '@/store/video-editor-store';

const STEP_TITLE = {
    select: 'Select a video',
    crop: 'Choose 5 seconds',
    metadata: 'Add details',
} as const;

const STEP_NUMBER = { select: 1, crop: 2, metadata: 3 } as const;

/** Three-step modal that turns a library video into a saved 5-second clip. */
export default function CropModal() {
    const router = useRouter();

    const step = useVideoEditorStore((state) => state.step);
    const sourceUri = useVideoEditorStore((state) => state.sourceUri);
    const sourceDurationSec = useVideoEditorStore((state) => state.sourceDurationSec);
    const trimStartSec = useVideoEditorStore((state) => state.trimStartSec);
    const setSource = useVideoEditorStore((state) => state.setSource);
    const setTrimStart = useVideoEditorStore((state) => state.setTrimStart);
    const goToStep = useVideoEditorStore((state) => state.goToStep);
    const reset = useVideoEditorStore((state) => state.reset);

    const createEntry = useCreateVideoEntry();

    const close = useCallback(() => {
        reset();
        router.back();
    }, [reset, router]);

    const pickVideo = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                'Permission needed',
                'Allow library access to pick a video to crop.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsMultipleSelection: false,
            quality: 1,
        });
        if (result.canceled) {
            return;
        }

        const asset = result.assets[0];
        const durationSec = asset.duration ? asset.duration / 1000 : 0;
        if (durationSec < CROP_DURATION_SEC) {
            Alert.alert(
                'Video too short',
                `Pick a video at least ${CROP_DURATION_SEC} seconds long.`
            );
            return;
        }

        setSource(asset.uri, durationSec);
        goToStep('crop');
    }, [goToStep, setSource]);

    const save = useCallback(
        (metadata: VideoMetadata) => {
            if (!sourceUri) {
                return;
            }
            createEntry.mutate(
                {
                    sourceUri,
                    startSec: trimStartSec,
                    endSec: trimStartSec + CROP_DURATION_SEC,
                    metadata,
                },
                {
                    onSuccess: close,
                    onError: (error) => {
                        Alert.alert(
                            'Could not crop video',
                            error instanceof Error ? error.message : 'Please try again.'
                        );
                    },
                }
            );
        },
        [close, createEntry, sourceUri, trimStartSec]
    );

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['bottom']}>
            <ScrollView
                contentContainerClassName="gap-6 p-5"
                keyboardShouldPersistTaps="handled"
            >
                <View className="gap-1">
                    <Text className="text-sm font-medium text-blue-600">
                        Step {STEP_NUMBER[step]} of 3
                    </Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                        {STEP_TITLE[step]}
                    </Text>
                </View>

                {step === 'select' && <SelectStep onPick={pickVideo} />}

                {step === 'crop' && sourceUri && (
                    <CropStep
                        sourceUri={sourceUri}
                        durationSec={sourceDurationSec}
                        startSec={trimStartSec}
                        onChangeStart={setTrimStart}
                        onBack={() => goToStep('select')}
                        onNext={() => goToStep('metadata')}
                    />
                )}

                {step === 'metadata' && (
                    <MetadataStep
                        isSubmitting={createEntry.isPending}
                        onSubmit={save}
                        onBack={() => goToStep('crop')}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
