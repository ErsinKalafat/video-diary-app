import { Text, View } from 'react-native';

interface MessageProps {
    text: string;
}

/** A full-screen, centered text message (e.g. empty or not-found states). */
export function Message({ text }: MessageProps) {
    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-black">
            <Text className="text-base text-gray-500 dark:text-gray-400">{text}</Text>
        </View>
    );
}
