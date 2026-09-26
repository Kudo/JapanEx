# LLP 0000: JapanEx

**Type:** Explainer
**Status:** Active
**Systems:** Application, Navigation, Tracker State, Storage, Map, Sharing, Export, Localization
**Role:** Root
**Author:** Codex / Kudo Chien
**Date:** 2026-08-18
**Revised:** 2026-09-26 (release-readiness behavior observed; design constraints confirmed by Kudo Chien on 2026-08-18)

## Summary

[observed] JapanEx is an offline-first Expo application for recording an experience level from 0 through 5 for each of Japan's 47 prefectures. It targets iOS, Android, and static web from one Expo Router project (`README.md`, `package.json`, and `app.json`).

[observed] The application is organized around a small versioned tracker state, bundled prefecture/map/flag data, platform-specific persistence and export adapters, and URL-encoded read-only sharing (`src/data/types.ts`, `src/state`, `src/storage`, `src/utils/share-state.ts`, and `src/utils/result-export*`).

[confirmed] (Kudo Chien, 2026-08-18) Core tracking, browsing, and export must work offline without a backend. The same complete dataset and tracker state can be rendered locally on every platform, while a shared URL carries the state needed by another client.

## Product behavior

[observed] A user assigns one of six experience levels to every prefecture; the score is the sum of all 47 levels and therefore ranges from 0 to 235 (`src/state/tracker-state.ts` and `src/data/types.ts`).

[observed] The main experience includes an interactive map, a searchable/filterable flag gallery, prefecture details, settings, and an about screen. Expo Router route files under `src/app` delegate their substantial UI to screen components under `src/screens` (`src/app` and `src/screens`).

[observed] The interface supports Japanese, Traditional Chinese, and English. The initial locale comes from `expo-localization`, unsupported device locales fall back to English, and the chosen locale is part of persisted and shared state (`src/i18n`, `src/state/tracker-state.ts`, and `src/utils/share-state.ts`).

[observed] Progress is stored locally, and users can create share URLs. Native persistence uses `expo-sqlite/kv-store`; web persistence uses `localStorage` through React Native's platform-file resolution. Android and iOS device backups may include the native SQLite database when backups are enabled (`src/storage/tracker-storage.ts`, `src/storage/tracker-storage.web.ts`, `app.json`, and `public/privacy/index.html`).

## System map

### Application shell and navigation

[observed] `src/app/_layout.tsx` is the runtime composition root. It installs the gesture root, tracker provider, navigation theme, root stack, and status bar. The tab layout selects native tabs on native platforms and a web-specific layout through `_layout.web.tsx` (`src/app/_layout.tsx` and `src/app/(tabs)/_layout*`).

[observed] Route modules remain thin. Shared stack behavior lives in `src/components/app-stack.tsx`; tab and stack route groups separate the map/flags experience from settings while allowing the map and flags tabs to share prefecture detail routes (`src/app` and `src/components/app-stack.tsx`).

### Tracker state and persistence

[observed] `TrackerStateV1` is the core domain object. `src/state/tracker-state.ts` creates, scores, and validates it; `src/state/tracker-context.tsx` owns the in-memory instance and exposes mutations to the UI; `src/storage/tracker-storage*` persists validated JSON (`src/data/types.ts`, `src/state`, and `src/storage`).

[observed] Persistence is deliberately behind the `TrackerStorage` interface, with native and web modules sharing the same API. The provider waits for the initial load to finish before saving state and surfaces storage failures without preventing the rest of the UI from rendering (`src/state/tracker-context.tsx` and `src/storage/tracker-storage*`).

[observed] The provider's `isReady` guard prevents its save effect from running before the initial storage load settles, so the freshly created empty state is not persisted during that load (`src/state/tracker-context.tsx`).

[observed] Mutations made before the initial storage load completes are replayed over the stored state in their original order, so an early edit or confirmed import is not overwritten by hydration (`src/state/tracker-context.tsx` and `src/state/tracker-hydration.ts`).

[observed] Saves are queued in state order so an earlier asynchronous write cannot finish after and overwrite a newer edit (`src/state/tracker-context.tsx` and `src/state/tracker-persistence.ts`).

[observed] If the initial storage read fails, the provider keeps the in-memory UI available but does not write its empty initial state over potentially recoverable stored progress (`src/state/tracker-context.tsx`).

### Prefecture data, map, and flags

[observed] `src/data/prefectures.json` is the metadata source, `src/data/map-shapes.json` supplies map geometry, and `src/data/prefectures.ts` combines them into typed runtime records. The 47 SVG flags and their thumbnail derivatives are bundled in `assets`, so core browsing and map rendering do not require a network request (`src/data`, `assets/flags`, and `assets/flag-thumbnails`).

[observed] The map UI is split across `japan-map.tsx`, map region/flag components, camera/layout utilities, and screen-level interaction state. Pure map camera and annotation behavior has dependency-free Node coverage (`src/components/japan-map.tsx`, `src/components/map-*`, `src/utils/map-*`, and matching tests).

### Adaptive accessibility layout

[observed] At accessibility text scales around 1.8 or greater, the map score card, map zoom controls, Settings summary, and Flags filter controls stack vertically so their labels and values do not overlap. The shared threshold is 1.75 to account for platform font-scale rounding. The Settings name field grows to fit scaled text. Level indicators can wrap their text, while decorative numeric seals cap their font growth to fit inside the circle. The surrounding screens remain scrollable (`src/constants/accessibility-layout.ts`, `src/components/tracker-snapshot.tsx`, `src/components/japan-map.tsx`, `src/components/level-indicator.tsx`, `src/screens/flags-screen.tsx`, and `src/screens/settings-screen.tsx`).

### Sharing and import

[observed] Shared state uses a versioned query contract: `v=1`, exactly 47 level digits in JIS code order, one supported locale, and an optional display name capped at 40 characters. Parsing rejects unsupported versions, malformed level strings, unsupported locales, and overlong names (`src/utils/share-state.ts` and `src/utils/share-state.test.mjs`).

[observed] `/view` renders valid shared state without replacing local progress. `/import` previews the incoming score and requires an explicit confirmation before replacing the current tracker state (`src/screens/shared-view-screen.tsx` and `src/screens/import-screen.tsx`).

[observed] A valid read-only view offers an explicit action to open the same snapshot in the confirmed-import screen. Canceling import returns to the view when navigation history permits; neither opening the preview nor canceling changes local progress (`src/screens/shared-view-screen.tsx` and `src/screens/import-screen.tsx`).

[observed] The import confirmation sheet opens at full height so its Replace and Cancel actions are visible immediately. A half-height initial detent hid both actions below the viewport on a Pixel 9 Pro Android Release build, requiring an undiscoverable drag to continue (`src/app/_layout.tsx` and `store/release-readiness.md`).

[confirmed] (Kudo Chien, 2026-08-18) `/view` must never modify local progress. Replacing local state is reserved for `/import` and requires explicit user confirmation.

[observed] Production links target `https://japanex.expo.app/view`; iOS associated domains, Android verified app links, and static `.well-known` files connect that URL to installed applications (`src/utils/share-state.ts`, `app.json`, and `public/.well-known`).

### Result rendering and export

[observed] `TrackerSnapshot` and `ResultCard` provide reusable read-only renderings of tracker state. The export path renders a fixed-size SVG surface and uses platform-specific result export adapters; image and flag readiness are coordinated before capture (`src/components/tracker-snapshot.tsx`, `src/components/result-card.tsx`, `src/utils/result-export*`, `src/utils/svg-capture.ts`, and `src/utils/image-load-barrier.ts`).

[observed] Native capture rounds the offscreen SVG layout size up to the device pixel ratio, then uses Expo ImageManipulator to normalize the PNG to exactly 2048×2048 physical pixels. Web capture scales its smaller SVG surface into a 2048-pixel canvas (`src/utils/result-card-size.ts`, `src/components/result-card.tsx`, `src/utils/svg-capture.ts`, and `src/utils/result-export.ts`).

[observed] The result image shortens a long display name to keep its label clear of the score; the saved tracker state and shared URL retain the full name. The image label uses a conservative width budget, and an iOS Release simulator export with a 40-character name rendered without overlap (`src/utils/result-display-name.ts`, `src/components/result-card.tsx`, and `store/release-readiness.md`).

[observed] iOS `react-native-svg` encodes PNG data with line breaks in its base64 output. Native export writes that string through Expo FileSystem's base64 encoding option, whose platform decoders accept the line breaks; passing the string through Hermes `atob` failed in a Release simulator build (`src/utils/result-export.ts` and the native module implementations).

[observed] The offscreen result-card readiness wait and SVG capture have bounded timeouts. If rendering or a flag image never reports completion, export shows a retryable error and releases its busy state instead of waiting indefinitely (`src/screens/map-screen.tsx`, `src/utils/svg-capture.ts`, and `src/utils/promise-timeout.ts`).

[observed] The Map screen shows localized progress while it prepares the result image, then clears that progress before opening the native share sheet (`src/screens/map-screen.tsx` and `src/i18n/translations.ts`).

[observed] Native capture waits for the offscreen SVG layout event in addition to its React ref before calling `toDataURL`; the iOS SVG bridge can return no image while the native view is still mounting. An empty callback result is treated as a capture error before writing a file (`src/screens/map-screen.tsx`, `src/components/result-card.tsx`, and `src/utils/svg-capture.ts`).

[confirmed] (Kudo Chien, 2026-08-18) Export must continue to produce a 2048×2048 PNG, and the assets needed for core map and flag rendering must remain bundled for offline use. The internal rendering and capture mechanisms may change if they preserve that behavior.

[observed] Recent git history concentrates fixes in map layout, flag readiness, SVG capture, and platform-specific UI behavior, so rendering/export is an active and comparatively delicate boundary (`git log --stat`, commits `a01ce16`, `5d9886c`, `853a8c5`, `0ef6523`, and `e3bab31`).

## Current invariants

[observed] The persisted and shared state version is exactly `1`; unknown versions are rejected rather than migrated implicitly (`src/state/tracker-state.ts` and `src/utils/share-state.ts`).

[confirmed] (Kudo Chien, 2026-08-18) Existing v1 share links must remain compatible. A future format that cannot preserve v1 semantics must use a new explicit version rather than reinterpret v1 payloads.

[observed] A valid state contains every code in `PREFECTURE_CODES`, every level is an integer from 0 through 5, the locale is `ja`, `zh-Hant`, or `en`, and the display name is at most 40 characters (`src/data/types.ts` and `src/state/tracker-state.ts`).

[observed] Prefecture order is significant because share payloads encode levels positionally. Encoding and decoding both iterate `PREFECTURE_CODES`; changing that order without a new share-state version would change the meaning of existing links (`src/utils/share-state.ts`).

[observed] Bundled data and legal attribution move together. The data validator checks prefecture records and app-link files, while `THIRD_PARTY_NOTICES.md` and the in-app about experience record flag/map sources and license constraints (`scripts/validate-data.mjs`, `THIRD_PARTY_NOTICES.md`, and `src/screens/about-screen.tsx`).

[observed] Native and web differences are expressed with platform files or narrowly scoped runtime checks. Existing examples include storage, result export, tab layout, language toolbars, and platform-specific behavior inside shared components (`*.web.ts`, `*.web.tsx`, and `process.env.EXPO_OS` call sites).

[confirmed] (Kudo Chien, 2026-08-18) Platform-specific implementations are permitted when required by platform capabilities or Expo limitations. User-visible behavior should otherwise remain consistent across iOS, Android, and web.

[observed] Expo SDK 57 is pinned throughout the project, and repository instructions require consulting the exact versioned Expo 57 documentation before changing code (`package.json` and `AGENTS.md`).

## Verification contract

[observed] `bun run verify` is the repository-wide check. It runs the data validator, Node's dependency-free test suite, TypeScript with `--noEmit`, and Expo ESLint (`package.json` and `README.md`).

[observed] Tests are colocated under `src/utils` as `*.test.mjs` and focus on pure cross-platform contracts: sharing, layout, map annotations, map camera behavior, image readiness, and SVG capture (`src/utils/*.test.mjs`).

[observed] The project intentionally does not include Jest or React Native Testing Library, so screen interaction and native/web integration still require manual verification on the affected targets (`README.md`).

## Orientation by change

[observed] For tracker data or scoring changes, start with `src/data/types.ts`, `src/state/tracker-state.ts`, `src/state/tracker-context.tsx`, and both storage adapters.

[observed] For map interaction or rendering changes, start with `src/screens/map-screen.tsx`, `src/components/japan-map.tsx`, `src/components/map-regions.tsx`, `src/utils/map-camera.ts`, and `src/utils/map-layout.ts`.

[observed] For sharing or deep-link changes, start with `src/utils/share-state.ts`, the `view` and `import` routes/screens, `app.json`, and `public/.well-known`.

[observed] For export changes, start with `src/components/result-card.tsx`, `src/components/tracker-snapshot.tsx`, `src/utils/result-export*`, `src/utils/svg-capture.ts`, and `src/utils/image-load-barrier.ts`.

[observed] For navigation or platform UI changes, start with the layouts under `src/app`, `src/components/app-stack.tsx`, the language toolbar variants, and the affected screen.
