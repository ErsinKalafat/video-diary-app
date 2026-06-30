# React Native Video Diary App - Project Plan and Roadmap

This document presents in detail the architecture, requirements, and 5-phase development roadmap of the requested React Native Video Diary application. The project is built around the **Expo Router**, **Zustand**, **Tanstack Query**, **expo-trim-video**, **NativeWind**, and **Expo SQLite** libraries.

---

## 📂 Folder Architecture (Architectural Scalability)
To keep the app extensible and maintainable, a hybrid **Feature-Based / Layered** folder structure has been chosen:

```text
├── app/                      # Expo Router file-based navigation
│   ├── (tabs)/               # Tab navigation (Home/List, Settings, etc.)
│   │   ├── index.tsx         # Home screen (list of cropped videos)
│   │   └── _layout.tsx       # Tab layout and Reanimated animations
│   ├── crop-modal.tsx        # Video cropping flow (modal screen)
│   ├── details/[id].tsx      # Video detail page
│   ├── edit/[id].tsx         # Video edit page (name/description)
│   └── _layout.tsx           # Root navigation configuration
├── components/               # Reusable UI components
│   ├── common/
│   │   ├── Button.tsx        # Custom NativeWind button component
│   │   └── Input.tsx         # Text input with error-message support
│   ├── video/
│   │   ├── VideoPlayer.tsx   # Expo Video-based player control
│   │   └── Scrubber.tsx      # Reanimated-powered 5-second selection bar
│   └── forms/
│       └── MetadataForm.tsx  # Zod/Yup-powered name and detail form
├── db/                       # SQLite database layer
│   ├── database.ts           # SQLite connection setup and initialization
│   └── videoQueries.ts       # CRUD operations (Add, Delete, Update, List)
├── hooks/                    # Tanstack Query and custom hooks
│   ├── useVideoMutations.ts  # useMutation hooks for expo-trim-video operations
│   └── useVideosQuery.ts     # Caching / synchronization of database queries
├── store/                    # Global state management
│   └── useVideoStore.ts      # Zustand store (active list and UI state)
├── schemas/                  # Form validation schemas
│   └── videoSchema.ts        # Zod validation rules for name and description
├── tailwind.config.js        # NativeWind configuration
└── package.json              # Dependency list
```

---

## 🚀 5-Phase Development Roadmap

### Phase 1: Project Setup and Base Configuration
**Goal:** Install the required dependencies without errors and establish a shared design language (NativeWind).

* **Initializing the Expo Project:**
  ```bash
  npx create-expo-app@latest VideoDiaryApp --template tabs
  ```
* **Installing the Required Libraries:**
  ```bash
  # Core & Styling
  npm install zustand @tanstack/react-query nativewind tailwindcss react-native-reanimated

  # Media and Processing
  npx expo install expo-video expo-image-picker expo-file-system
  npm install expo-trim-video # Core cropping library

  # Form and Database
  npx expo install expo-sqlite
  npm install zod react-hook-form @hookform/resolvers
  ```
* **NativeWind Configuration:** Set up the `tailwind.config.js` and `global.css` files so Tailwind classes can be used in components.

---

### Phase 2: Database and Global State (Zustand + SQLite)
**Goal:** Ensure data is not lost even when the app is closed and reopened, and build a fast in-app access layer.

* **SQLite Database Schema:**
  When the app launches for the first time, the following SQL schema is run inside `db/database.ts`:
  ```sql
  CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      original_uri TEXT NOT NULL,
      cropped_uri TEXT NOT NULL,
      created_at INTEGER NOT NULL
  );
  ```
* **Zustand Store Synchronization:**
  * The state holds a `videos: Video[]` array and statuses such as `isLoading`.
  * Data coming from SQLite queries is fed into the Zustand state, so the UI can be updated optimistically (instantly).

---

### Phase 3: Modal Flow and Video Cropping (Core Feature)
**Goal:** Allow the user to select a video, define a 5-second range, pass validation, and crop the video.

* **Step 1: Video Selection (Expo Image Picker):**
  * The user can select only video-format media from their gallery (`mediaTypes: ['videos']`).
* **Step 2: Video Cropping (Scrubber & Expo Video):**
  * The selected video is loaded into the `expo-video` player.
  * The user is presented with a `Scrubber` for choosing the start time. The end time is automatically locked to `start + 5 seconds`.
* **Step 3: Form Validation (Zod & React Hook Form):**
  * Schema rules: the `name` field is required (at least 3 characters), the `description` field is optional (at most 200 characters).
* **Tanstack Query Integration (useMutation):**
  * When cropping is triggered, the `trimVideo` function of the `expo-trim-video` library is called asynchronously.
  * While the operation is in progress, an `ActivityIndicator` (loading spinner/graphic) is shown on screen.
  * When the operation completes, the output is taken from the local disk (`FileSystem`) and saved to the SQLite database.

---

### Phase 4: Screen Development (UI/UX)
**Goal:** Build the screen designs that make the user experience smooth and wire up the navigation links.

* **Home Screen (List of Cropped Videos):**
  * Previously saved videos are listed. Each item shows a small preview (thumbnail) or a video icon next to it.
  * If the list is empty, a stylish "You haven't added any videos yet" empty-state component, animated with `React Native Reanimated`, is shown.
* **Detail Page:**
  * Following minimalist design principles, the top section contains only the video player (`VideoPlayer`), while the bottom section shows the video name and description in large type.
* **Edit Page (Optional):**
  * A form opens to update the details of the existing video. When the Save button is pressed, a SQLite `UPDATE` query is run and the Zustand store is updated.

---

### Phase 5: Enhancements, Animation, and Optimization
**Goal:** Improve the app's performance, strengthen error handling, and enrich it with animations.

* **Reanimated Animations:**
  * When a new video is added to the list, the list smoothly scrolls/shifts down (`Layout.springify()`).
  * Smooth opacity (fade-in/out) effects during modal transitions and between steps (Step 1 -> Step 2 -> Step 3).
* **Performance & Memory Management:**
  * Checking file paths so cropped videos don't take up unnecessary space on the device or bloat the cache.
  * Connecting error-handling (`try-catch`) blocks to the Tanstack Query `onError` mechanism to prevent the app from crashing while processing large video files.

---

## 🛠️ Technical Success Criteria and Tips

1. **5-Second Constraint:** To verify that the total duration is 5 seconds while the user drags the scrubber, a validation function must always be run before the form is submitted (`endTime - startTime === 5`).
2. **Tanstack Query Advantage:** Since the cropping operation can take a long time, the `useMutation` structure makes it easy to offer the user a "Retry" option if the operation is interrupted.
3. **Clean Code:** The `MetadataForm` component should be designed (prop-based) to be shared by both the **New Record** module and the **Edit** page.

When this roadmap is followed, all of the case study requirements will be met completely, performantly, and to a professional standard.
