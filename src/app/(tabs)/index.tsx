import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/home/empty-state';
import { VideoListItem } from '@/components/home/video-list-item';
import { Button } from '@/components/ui/button';
import { useVideoStore } from '@/store/video-store';

export default function HomeScreen() {
  const router = useRouter();
  const videos = useVideoStore((state) => state.videos);
  const loadVideos = useVideoStore((state) => state.loadVideos);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 gap-4 p-5">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          Video Diary
        </Text>
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VideoListItem
              video={item}
              onPress={() =>
                router.push({ pathname: '/details/[id]', params: { id: item.id } })
              }
            />
          )}
          contentContainerStyle={{ flexGrow: 1, gap: 12 }}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
        />
        <Button label="Add video" onPress={() => router.push('/crop-modal')} />
      </View>
    </SafeAreaView>
  );
}
