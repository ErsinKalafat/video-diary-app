import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';

interface SelectStepProps {
    onPick: () => void;
}

/** Step 1: prompt the user to pick a source video from their library. */
export function SelectStep({ onPick }: SelectStepProps) {
    return (
        <View className="gap-4">
            <Text className="text-base text-white/70">
                Pick a video from your library, then trim it down to a 5-second
                highlight.
            </Text>
            <Button label="Choose from library" onPress={onPick} />
        </View>
    );
}
