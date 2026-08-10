# JapanEx

JapanEx is an offline-first Expo app for recording how deeply you have experienced Japan's 47 prefectures. It is a modern, universal rewrite of [ukyouz/JapanEx](https://github.com/ukyouz/JapanEx) for iOS, Android, and web.

## Features

- Interactive JapanEx map with six experience levels and a score from 0–235.
- Simultaneous pinch-to-zoom and drag-to-pan powered by Gesture Handler and Reanimated.
- Searchable, filterable gallery of all 47 official prefecture flags.
- Native Expo Router tabs with per-tab stacks, native search, and header toolbars.
- Japanese, Traditional Chinese, and English interfaces.
- Device-local persistence with `expo-sqlite/kv-store` on native and `localStorage` on web.
- Versioned view-only links that preserve the recipient's saved progress, plus legacy import confirmation.
- 2048×2048 PNG result export directly from the SVG surface—no screenshot library.
- Fully bundled flags and data for offline use.

## Development

```bash
bun install
cp .env.example .env.local
bun start
```

Shared links default to `https://japanex.expo.app/view`. Set `EXPO_PUBLIC_SHARE_BASE_URL` only when a development or preview build needs a different HTTPS origin.

The web export includes the Apple App Site Association file for `japanex.expo.app`, and the app config enables iOS Universal Links for `/view`. Android also registers the matching App Link intent filter.

### Android App Link verification TODO

After the production Android signing certificate is available, add `public/.well-known/assetlinks.json` with package `dev.expo.kudo.japanex` and the Play App Signing certificate's SHA-256 fingerprint. Until that file is deployed, Android view links continue to work on the web but are not verified to open the installed app directly.

Useful commands:

```bash
bun run ios
bun run android
bun run web
bun run verify
bun run export:web
```

The project intentionally does not include Jest or React Native Testing Library. `bun run verify` runs the dependency-free data validator and Node tests, followed by TypeScript and Expo ESLint checks.

## Project layout

- `src/app` contains Expo Router route files, native tab groups, and per-tab stacks.
- `src/screens` contains route screen bodies.
- `src/components` contains reusable map, flag, level, and export UI.
- `src/data` contains the JIS-ordered prefecture manifest and original JapanEx map geometry.
- `src/state`, `src/storage`, and `src/utils` contain persistence, state-link, and PNG-export adapters.
- `assets/flags` contains the 47 offline Wikimedia Commons SVGs.

## Attribution

The schematic map and original behavior are adapted from [JapanEx](https://github.com/ukyouz/JapanEx), MIT License, copyright 2018–present JapanEx contributors.

Flag SVGs come from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_flags_of_prefectures_of_Japan). Hiroshima and Kagawa are CC BY-SA 3.0; the remaining bundled files were marked public domain when collected. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) and the in-app Credits & Licenses screen.

Official insignia may be subject to laws governing government symbols or misuse independently of copyright.
