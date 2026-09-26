# Google Play screenshots

These screenshots were captured from the Android release APK in English with representative local progress. They are unframed, portrait PNGs with a normalized 10:00 status bar.

`03-flags.png` in each set shows the previous collection heading and count, and `04-settings.png` shows the previous score layout and privacy wording. Recapture those two phone images and all eight tablet images from the final release build before store upload, then check that every screenshot matches the submitted app.

The current tablet captures use a 5:8 portrait ratio. Google's [preview-asset guidance](https://support.google.com/googleplay/android-developer/answer/9866151) says to use 9:16 portrait screenshots for large screens. Capture the final tablet sets directly from 9:16 tablet device profiles, such as 1080 × 1920 for 7-inch and 1440 × 2560 for 10-inch if those profiles show the actual tablet UI. Do not stretch or crop the existing images to force that ratio. Check the final files in Play Console before upload.

## Upload sets

| Play Console slot | Directory | Current draft dimensions | Final capture target | Files |
| --- | --- | --- | --- | --- |
| Phone screenshots | `phone/en-US/` | 1080 × 1920 | 1080 × 1920 | 4 |
| 7-inch tablet screenshots | `7-inch-tablet/en-US/` | 1200 × 1920 | 9:16 native capture | 4 |
| 10-inch tablet screenshots | `10-inch-tablet/en-US/` | 1600 × 2560 | 9:16 native capture | 4 |

## Sequence and alt text

1. `01-map.png`
   - A color-coded map of Japan showing a Japan score and experience levels across 47 prefectures.
2. `02-prefecture.png`
   - The Hokkaido detail screen showing its prefectural flag and selected travel experience level.
3. `03-flags.png`
   - The prefecture flag gallery with region and experience-level filters.
4. `04-settings.png`
   - JapanEx settings showing the display name, English language selection, sharing, privacy, and reset controls.

Upload the four files in filename order for each device type. The app data is intentionally identical across all three sets so the score and prefecture states remain consistent.
