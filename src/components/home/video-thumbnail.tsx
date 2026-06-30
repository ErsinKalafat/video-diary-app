import { Image } from 'expo-image';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface VideoThumbnailProps {
    /** Local URI of the cropped clip to generate a poster frame from. */
    uri: string;
}

/** A square poster frame for a clip, with a play badge overlay. */
export function VideoThumbnail({ uri }: VideoThumbnailProps) {
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        VideoThumbnails.getThumbnailAsync(uri, { time: 0 })
            .then((result) => active && setThumbnail(result.uri))
            .catch(() => undefined);
        return () => {
            active = false;
        };
    }, [uri]);

    return (
        <View className="h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
            {thumbnail ? (
                <Image
                    source={{ uri: thumbnail }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
            ) : null}
            <View className="absolute inset-0 items-center justify-center">
                <Text className="text-base text-white">▶</Text>
            </View>
        </View>
    );
}
