import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';

import { styles } from './screen-background.styles';

/** Deep night gradient that gives the glassy cards something to sit on. */
const GRADIENT_COLORS = ['#0f172a', '#1e1b4b', '#4c1d95'] as const;

/** Full-screen gradient backdrop shared by every screen for a consistent look. */
export function ScreenBackground({ children }: { children: ReactNode }) {
    return (
        <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.fill}
        >
            {children}
        </LinearGradient>
    );
}
