import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Text, View } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/home/empty-state';
import { VideoListItem } from '@/components/home/video-list-item';
import { Button } from '@/components/ui/button';
import { ScreenBackground } from '@/components/ui/screen-background';
import { type VideoEntry } from '@/db/schema';
import { alertError } from '@/lib/errors';
import { useRemoveVideo } from '@/hooks/use-video-mutations';
import { useVideoStore } from '@/store/video-store';

export default function HomeScreen() {
  const router = useRouter();
  const videos = useVideoStore((state) => state.videos);
  const loadVideos = useVideoStore((state) => state.loadVideos);
  const removeVideo = useRemoveVideo();

  const listRef = useRef<FlashListRef<VideoEntry>>(null);
  const previousCount = useRef(videos.length);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // New entries are prepended, so reveal the top when the list grows.
  useEffect(() => {
    if (videos.length > previousCount.current) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
    previousCount.current = videos.length;
  }, [videos.length]);

  const confirmDelete = (video: VideoEntry) => {
    Alert.alert('Delete video', `Delete “${video.name}”?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          removeVideo.mutate(video.id, {
            onError: (error) => alertError('Could not delete', error),
          }),
      },
    ]);
  };

  return (
    <ScreenBackground>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 gap-4 p-5">
          <Text className="text-3xl font-bold text-white">Video Diary</Text>
          <FlashList
            ref={listRef}
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VideoListItem
                video={item}
                onPress={() =>
                  router.push({ pathname: '/details/[id]', params: { id: item.id } })
                }
                onDelete={() => confirmDelete(item)}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-3" />}
            ListEmptyComponent={EmptyState}
            showsVerticalScrollIndicator={false}
          />
          <Button label="Add video" onPress={() => router.push('/crop-modal')} />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}
