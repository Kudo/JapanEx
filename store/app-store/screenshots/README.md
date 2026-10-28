# App Store screenshots

Review screenshots against the final signed build after the UI and export smoke test. Apple permits screenshots captured from Simulator for App Store submission; recapture any screen whose final signed UI differs. Keep captures free of fabricated progress, private data, and altered controls. See [Apple's Xcode capture guidance](https://developer.apple.com/documentation/xcode/capturing-screenshots-and-videos-from-devices).

`draft-simulator/` contains an eight-image English review set captured from local iOS Release simulator builds on 2026-09-25 and 2026-09-26. It covers Map, Hokkaido detail, Flags, and Settings on an iPhone 17 Pro Max and a 13-inch iPad Pro. The app's import flow set five prefectures to representative levels for a score of 14; the display name was left empty. The updated iPad set was captured on iPadOS 18 after the Flags width fix, and the iPhone Settings image shows the shorter display-name copy. The captures have a 9:41 status bar and native pixel dimensions. Each file is an opaque PNG; the iPad simulator's fully opaque alpha channel was removed without changing visible pixels. These remain review drafts until compared with the final signed app.

| Source directory | Device class | Capture size |
| --- | --- | --- |
| `iphone/en-US/` | 6.9-inch iPhone | 1320 × 2868 |
| `ipad/en-US/` | 13-inch iPad | 2064 × 2752 |

Use `01-map.png`, `02-prefecture.png`, `03-flags.png`, and `04-settings.png` for a consistent sequence. Capture representative progress, but remove any personal display name or private share link. Check final accepted sizes against [Apple's screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications) when uploading. Add localized sets only if their visible UI text matches the listing locale.

## English upload sets

The `designed/` directories contain navy-background headline screenshots rendered from the original captures. The full app screen is uniformly scaled to 80% of the output height without cropping or stretching. Upload each four-file set in filename order:

| App Store Connect slot | Upload directory | Output size |
| --- | --- | --- |
| iPhone 6.1-inch or 6.3-inch | `designed/iphone/en-US/` | 1206 × 2622 |
| iPad 12.9-inch or 13-inch | `designed/ipad/en-US/` | 2064 × 2752 |

Both sizes are listed in [Apple's screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications). Run `python3 store/render-store-screenshots.py` from the repository root to regenerate the files and `store/store-screenshots-preview-en-US.png` (requires Pillow and macOS Arial Bold). The preview sheet is for review, not upload. English screenshots are the only prepared screenshot locale. Compare the underlying captures with the final signed build before submission.
