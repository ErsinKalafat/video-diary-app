import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';

import { styles } from './button.styles';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
}

/** Vivid gradient for the primary call-to-action. */
const PRIMARY_GRADIENT = ['#6366f1', '#8b5cf6', '#d946ef'] as const;

/** A full-width button: gradient for primary, frosted glass for secondary. */
export function Button({ label, onPress, variant = 'primary' }: ButtonProps) {
    if (variant === 'secondary') {
        return (
            <Pressable
                className="items-center rounded-2xl border border-white/30 bg-white/10 py-3.5 active:bg-white/20"
                onPress={onPress}
            >
                <Text className="text-base font-semibold text-white">{label}</Text>
            </Pressable>
        );
    }

    return (
        <Pressable className="active:opacity-90" onPress={onPress}>
            <LinearGradient
                colors={PRIMARY_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text className="text-base font-semibold text-white">{label}</Text>
            </LinearGradient>
        </Pressable>
    );
}
