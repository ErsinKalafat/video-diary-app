# Video Diary App

A React Native app for keeping a video diary. Pick a video from your library,
crop a **5-second** moment, give it a name and description, and save it to a
local list that survives app restarts.

Built with **Expo Router**, **Zustand**, **Tanstack Query**, **expo-trim-video**,
**NativeWind**, and **Expo SQLite**.

---

## Features

- Import a video from the device library.
- Crop an exact 5-second window with a draggable scrubber (end locks to `start + 5s`).
- Add a name and description, validated with Zod + React Hook Form.
- Cropped clips are saved to SQLite and listed on the home screen.
- View a clip on its detail page or edit its name/description.
- Reanimated touches: animated empty state, list item entrance, and step fades.

---

## Requirements

- Node.js 18+
- A **development build** is required because `expo-trim-video` is a native
  module and does not run in Expo Go.
- **iOS:** Xcode + an iOS Simulator (or a physical device).
- **Android:** Android Studio + an emulator (or a physical device).

---

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run a development build:

   ```bash
   # iOS (simulator or connected device)
   npx expo run:ios

   # Android (emulator or connected device)
   npx expo run:android
   ```

   After the first native build, you can start the dev server on its own with:

   ```bash
   npx expo start --dev-client
   ```

---

## Usage

1. On the home screen, tap **Add video**.
2. **Step 1 — Select:** choose a video (at least 5 seconds long) from your library.
3. **Step 2 — Crop:** drag the scrubber to pick the 5-second window to keep.
4. **Step 3 — Details:** enter a name (min 3 chars) and an optional description, then save.
5. The cropped clip appears in the list. Tap it to view, or open **Edit details** to change its metadata.

---

## Project structure

```text
src/
├── app/                          # Expo Router file-based navigation
│   ├── _layout.tsx               # Root Stack (providers, theme, hosts tabs + modal)
│   ├── (tabs)/                   # Tab group
│   │   ├── _layout.tsx           # Tab bar navigator
│   │   └── index.tsx             # Home screen (list of cropped videos)
│   ├── crop-modal.tsx            # 3-step cropping flow (modal)
│   ├── details/[id].tsx          # Video detail page
│   └── edit/[id].tsx             # Edit name/description
├── components/
│   ├── crop/                     # select-step, crop-step, metadata-step
│   ├── home/                     # video-list-item, empty-state
│   ├── ui/                       # button, message (atomic UI)
│   ├── metadata-form.tsx         # Shared Zod form (create & edit)
│   ├── scrubber.tsx              # Reanimated 5-second selection bar
│   └── video-player.tsx          # Expo Video player
├── db/                           # SQLite layer (schema, queries, init)
├── hooks/
│   ├── use-video.ts              # useVideoById selector
│   └── use-video-mutations.ts    # Tanstack Query mutations (async only)
├── lib/
│   ├── query-client.ts           # Shared Tanstack Query client
│   └── video-files.ts            # Cropped-file cleanup helper
└── store/
    ├── video-store.ts            # Persisted list (source of truth, synced w/ SQLite)
    └── video-editor-store.ts     # Ephemeral crop-flow state
```

**State ownership:** the persisted list lives in the Zustand store (`video-store.ts`)
and is kept in sync with SQLite. Tanstack Query is used only for async/mutation
work (the native crop and disk writes), providing loading/error/retry state.
