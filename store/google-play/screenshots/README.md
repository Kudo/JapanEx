# Google Play screenshots

These screenshots were captured from the current local Android Release APK in English with five representative prefecture levels totaling a score of 14. The display name was left empty. They are unframed, opaque portrait PNGs with a normalized 10:00 status bar.

The phone, 7-inch tablet, and 10-inch tablet sets each show Map, Hokkaido detail, Flags, and Settings from the same local build. The phone Settings capture is scrolled to show display-name, language, and view-link controls. Compare all twelve images with the final signed Play build before upload, and recapture any UI that differs.

Google's [preview-asset guidance](https://support.google.com/googleplay/android-developer/answer/9866151) calls for 9:16 portrait screenshots on large screens. The new tablet captures came directly from isolated Nexus 7 and Nexus 10 emulator profiles configured at 1080 × 1920, 288 dpi and 1440 × 2560, 280 dpi, respectively; no image was stretched or cropped. The emulator's fully opaque alpha channel was removed without changing RGB pixels. Check the final files in Play Console before upload.

## Upload sets

| Play Console slot | Directory | Draft dimensions | Files |
| --- | --- | --- | --- |
| Phone screenshots | `phone/en-US/` | 1080 × 1920 | 4 |
| 7-inch tablet screenshots | `7-inch-tablet/en-US/` | 1080 × 1920 | 4 |
| 10-inch tablet screenshots | `10-inch-tablet/en-US/` | 1440 × 2560 | 4 |

## Sequence and alt text

1. `01-map.png`
   - A color-coded map of Japan showing a Japan score and experience levels across 47 prefectures.
2. `02-prefecture.png`
   - The Hokkaido detail screen showing its prefectural flag and selected travel experience level.
3. `03-flags.png`
   - The prefecture flag gallery with region and experience-level filters.
4. `04-settings.png`
   - JapanEx settings showing the display name, English language selection, and view-link sharing controls.

Upload the four files in filename order for each device type. The app data is intentionally identical across all three sets so the score and prefecture states remain consistent.
