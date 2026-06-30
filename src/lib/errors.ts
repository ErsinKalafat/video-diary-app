import { Alert } from 'react-native';

/** Extract a human-readable message from an unknown thrown value. */
export function toErrorMessage(
    error: unknown,
    fallback = 'Something went wrong'
): string {
    return error instanceof Error ? error.message : fallback;
}

/** Show a standard error alert for a failed mutation. */
export function alertError(title: string, error: unknown): void {
    Alert.alert(title, toErrorMessage(error, 'Please try again.'));
}
