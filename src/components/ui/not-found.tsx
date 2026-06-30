import { Message } from '@/components/ui/message';
import { ScreenBackground } from '@/components/ui/screen-background';

/** Full-screen placeholder shown when a clip id no longer exists. */
export function NotFound({ text = 'Video not found.' }: { text?: string }) {
    return (
        <ScreenBackground>
            <Message text={text} />
        </ScreenBackground>
    );
}
