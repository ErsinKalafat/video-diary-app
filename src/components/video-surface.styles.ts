import { StyleSheet } from 'react-native';

/** VideoView ignores NativeWind className, so its sizing lives here. */
export const styles = StyleSheet.create({
    video: { width: '100%', aspectRatio: 16 / 9 },
});
