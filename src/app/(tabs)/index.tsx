import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/home/empty-state';
import { VideoListItem } from '@/components/home/video-list-item';
import { Button } from '@/components/ui/button';
import { type VideoEntry } from '@/db/schema';
import { useRemoveVideo } from '@/hooks/use-video-mutations';
import { useVideoStore } from '@/store/video-store';

export default function HomeScreen() {
  const router = useRouter();
  const videos = useVideoStore((state) => state.videos);
  const loadVideos = useVideoStore((state) => state.loadVideos);
  const removeVideo = useRemoveVideo();

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const confirmDelete = (video: VideoEntry) => {
    Alert.alert('Delete video', `Delete “${video.name}”?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          removeVideo.mutate(video.id, {
            onError: (error) =>
              Alert.alert(
                'Could not delete',
                error instanceof Error ? error.message : 'Please try again.'
              ),
          }),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 gap-4 p-5">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          Video Diary
        </Text>
        <FlashList
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
  );
}
