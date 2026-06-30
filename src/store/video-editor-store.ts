import { create } from 'zustand';

/** Every saved clip is exactly this long (case study requirement). */
export const CROP_DURATION_SEC = 5;

/** Steps of the "create a diary entry" flow. */
export type EditorStep = 'select' | 'crop' | 'metadata';

interface VideoEditorState {
    step: EditorStep;
    /** Source video chosen from the library, before cropping. */
    sourceUri: string | null;
    /** Total length of the source video, in seconds. */
    sourceDurationSec: number;
    /** Start of the fixed 5-second crop window, in seconds. */
    trimStartSec: number;

    setSource: (uri: string, durationSec: number) => void;
    setTrimStart: (startSec: number) => void;
    goToStep: (step: EditorStep) => void;
    reset: () => void;
}

const initialState = {
    step: 'select' as EditorStep,
    sourceUri: null,
    sourceDurationSec: 0,
    trimStartSec: 0,
};

/** Clamp the window start so [start, start + 5] stays within the video. */
function clampStart(startSec: number, durationSec: number): number {
    const maxStart = Math.max(0, durationSec - CROP_DURATION_SEC);
    return Math.min(Math.max(startSec, 0), maxStart);
}

/**
 * Ephemeral UI state for the multi-step video creation flow.
 * Persisted data lives in SQLite + the video store; this store only tracks the
 * in-progress draft so the modal's steps can share it without prop drilling.
 * The crop window length is fixed, so we only track its start.
 */
export const useVideoEditorStore = create<VideoEditorState>((set, get) => ({
    ...initialState,
    setSource: (sourceUri, sourceDurationSec) =>
        set({ sourceUri, sourceDurationSec, trimStartSec: 0 }),
    setTrimStart: (startSec) =>
        set({ trimStartSec: clampStart(startSec, get().sourceDurationSec) }),
    goToStep: (step) => set({ step }),
    reset: () => set(initialState),
}));
