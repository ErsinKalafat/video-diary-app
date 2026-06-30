import { Pressable, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
}

const containerStyle: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary:
        'border border-gray-300 active:bg-gray-100 dark:border-gray-600 dark:active:bg-gray-800',
};

const labelStyle: Record<ButtonVariant, string> = {
    primary: 'text-white',
    secondary: 'text-gray-900 dark:text-white',
};

/** A single full-width button used across the app. */
export function Button({ label, onPress, variant = 'primary' }: ButtonProps) {
    return (
        <Pressable
            className={`items-center rounded-xl py-3.5 ${containerStyle[variant]}`}
            onPress={onPress}
        >
            <Text className={`text-base font-semibold ${labelStyle[variant]}`}>
                {label}
            </Text>
        </Pressable>
    );
}
