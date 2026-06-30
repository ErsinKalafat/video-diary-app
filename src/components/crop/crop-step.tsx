import { Text, View } from 'react-native';

import { CropPreview } from '@/components/crop/crop-preview';
import { Scrubber } from '@/components/scrubber';
import { Button } from '@/components/ui/button';
import { CROP_DURATION_SEC } from '@/store/video-editor-store';

interface CropStepProps {
    sourceUri: string;
    durationSec: number;
    startSec: number;
    onChangeStart: (startSec: number) => void;
    onBack: () => void;
    onNext: () => void;
}

/** Format a number of seconds as `m:ss`. */
function formatTime(totalSeconds: number): string {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

/** Step 2: preview the video and pick the 5-second window to keep. */
export function CropStep({
    sourceUri,
    durationSec,
    startSec,
    onChangeStart,
    onBack,
    onNext,
}: CropStepProps) {
    const endSec = startSec + CROP_DURATION_SEC;

    return (
        <View className="gap-4">
            <CropPreview
                uri={sourceUri}
                startSec={startSec}
                windowSec={CROP_DURATION_SEC}
            />

            <View className="flex-row justify-between">
                <Text className="text-sm text-white/70">
                    Start {formatTime(startSec)}
                </Text>
                <Text className="text-sm font-semibold text-fuchsia-300">
                    {CROP_DURATION_SEC}s clip
                </Text>
                <Text className="text-sm text-white/70">
                    End {formatTime(endSec)}
                </Text>
            </View>

            <Scrubber
                durationSec={durationSec}
                windowSec={CROP_DURATION_SEC}
                startSec={startSec}
                onChange={onChangeStart}
            />

            <View className="flex-row gap-3">
                <View className="flex-1">
                    <Button label="Back" variant="secondary" onPress={onBack} />
                </View>
                <View className="flex-1">
                    <Button label="Next" onPress={onNext} />
                </View>
            </View>
        </View>
    );
}
