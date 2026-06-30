import { Text, View } from 'react-native';

interface MessageProps {
    text: string;
}

/** A full-screen, centered text message (e.g. empty or not-found states). */
export function Message({ text }: MessageProps) {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-base text-white/60">{text}</Text>
        </View>
    );
}
