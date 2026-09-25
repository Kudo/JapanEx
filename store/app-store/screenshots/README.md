# App Store screenshots

Capture these from the final signed build after the UI and export smoke test. Keep the unedited source captures here until the publisher has reviewed them.

`draft-simulator/` contains an eight-image review set captured on 2026-09-25 from the local iOS Release simulator app. It covers the Map, Hokkaido detail, Flags, and Settings on an iPhone 17 Pro Max and a 13-inch iPad. The app's import flow set five prefectures to representative levels for a score of 14; the display name was left empty. The captures have a 9:41 status bar, native pixel dimensions, and no alpha channel. These are layout and listing-copy drafts; recapture the upload set from the final signed build and check it against that build before submission.

| Directory | Device class | Suggested portrait pixel size |
| --- | --- | --- |
| `iphone/en-US/` | 6.9-inch iPhone | 1320 × 2868 |
| `ipad/en-US/` | 13-inch iPad | 2064 × 2752 |

Use `01-map.png`, `02-prefecture.png`, `03-flags.png`, and `04-settings.png` for a consistent sequence. Capture representative progress, but remove any personal display name or private share link. Check final accepted sizes against [Apple's screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications) when uploading. Add localized sets only if their visible UI text matches the listing locale.
