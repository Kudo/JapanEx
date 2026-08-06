# JapanEx

JapanEx is an offline-first Expo app for recording how deeply you have experienced Japan's 47 prefectures. It is a modern, universal rewrite of [ukyouz/JapanEx](https://github.com/ukyouz/JapanEx) for iOS, Android, and web.

## Features

- Interactive JapanEx map with six experience levels and a score from 0–235.
- Simultaneous pinch-to-zoom and drag-to-pan powered by Gesture Handler and Reanimated.
- Searchable, filterable gallery of all 47 official prefecture flags.
- Japanese, Traditional Chinese, and English interfaces.
- Device-local persistence with `expo-sqlite/kv-store` on native and `localStorage` on web.
- Versioned state links with validation and import confirmation.
- 2048×2048 PNG result export directly from the SVG surface—no screenshot library.
- Fully bundled flags and data for offline use.

## Development

```bash
npm install
cp .env.example .env.local
npm start
```

Set `EXPO_PUBLIC_SHARE_BASE_URL` to the HTTPS origin hosting the web build so shared state links open `/import`. Without it, development builds use the current Expo URL or native `japanex` scheme.

Useful commands:

```bash
npm run ios
npm run android
npm run web
npm run verify
npm run export:web
```

The project intentionally does not include Jest or React Native Testing Library. `npm run verify` runs the dependency-free data validator, TypeScript, and Expo ESLint checks.

## Project layout

- `src/app` contains Expo Router route files only.
- `src/screens` contains route screen bodies.
- `src/components` contains reusable map, flag, level, and export UI.
- `src/data` contains the JIS-ordered prefecture manifest and original JapanEx map geometry.
- `src/state`, `src/storage`, and `src/utils` contain persistence, state-link, and PNG-export adapters.
- `assets/flags` contains the 47 offline Wikimedia Commons SVGs.

## Attribution

The schematic map and original behavior are adapted from [JapanEx](https://github.com/ukyouz/JapanEx), MIT License, copyright 2018–present JapanEx contributors.

Flag SVGs come from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_flags_of_prefectures_of_Japan). Hiroshima and Kagawa are CC BY-SA 3.0; the remaining bundled files were marked public domain when collected. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) and the in-app Credits & Licenses screen.

Official insignia may be subject to laws governing government symbols or misuse independently of copyright.
