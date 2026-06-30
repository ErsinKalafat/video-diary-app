import { create } from 'zustand';

/** Steps of the "create a diary entry" flow. */
export type EditorStep = 'select' | 'crop' | 'metadata';

interface VideoEditorState {
    step: EditorStep;
    /** Source video chosen from the library, before cropping. */
    sourceUri: string | null;
    sourceDurationMs: number;
    /** Selected crop window, in milliseconds, relative to the source. */
    trimStartMs: number;
    trimEndMs: number;
    /** Result of the trim operation, ready to be persisted. */
    croppedUri: string | null;

    setSource: (uri: string, durationMs: number) => void;
    setTrim: (startMs: number, endMs: number) => void;
    setCroppedUri: (uri: string) => void;
    goToStep: (step: EditorStep) => void;
    reset: () => void;
}

const initialState = {
    step: 'select' as EditorStep,
    sourceUri: null,
    sourceDurationMs: 0,
    trimStartMs: 0,
    trimEndMs: 0,
    croppedUri: null,
};

/**
 * Ephemeral UI state for the multi-step video creation flow.
 * Persisted data lives in SQLite + React Query; this store only tracks the
 * in-progress draft so screens can share it without prop drilling.
 */
export const useVideoEditorStore = create<VideoEditorState>((set) => ({
    ...initialState,
    setSource: (sourceUri, sourceDurationMs) =>
        set({ sourceUri, sourceDurationMs, trimStartMs: 0, trimEndMs: sourceDurationMs }),
    setTrim: (trimStartMs, trimEndMs) => set({ trimStartMs, trimEndMs }),
    setCroppedUri: (croppedUri) => set({ croppedUri }),
    goToStep: (step) => set({ step }),
    reset: () => set(initialState),
}));
