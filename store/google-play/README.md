# Google Play submission metadata

This directory contains copy/paste-ready metadata for the first Google Play release of JapanEx.

## Listing files

| Play locale | App locale | Listing directory |
| --- | --- | --- |
| English (United States) | `en` | `listings/en-US/` |
| Japanese (Japan) | `ja` | `listings/ja-JP/` |
| Chinese (Traditional, Taiwan) | `zh-Hant` | `listings/zh-TW/` |

Each listing directory contains:

- `title.txt` — maximum 30 characters
- `short-description.txt` — maximum 80 characters
- `full-description.txt` — maximum 4,000 characters

The localized `release-notes/` files contain the first-release text. Paste them into the release's "What's new" field after uploading the Android App Bundle.

Localized, upload-ready feature graphics are in `assets/`:

- `feature-graphic-en-US.png`
- `feature-graphic-ja-JP.png`
- `feature-graphic-zh-TW.png`

Each is an opaque 1024 × 500 PNG. `feature-graphic-base.png` is the text-free master for future localizations, and `feature-graphic-base-source.png` preserves the original generated artwork.

English screenshot drafts are in `screenshots/`:

- `phone/en-US/` — four 1080 × 1920 PNGs
- `7-inch-tablet/en-US/` — four 1200 × 1920 PNGs
- `10-inch-tablet/en-US/` — four 1600 × 2560 PNGs

Each set uses the same sequence: map, Hokkaido detail, flag gallery, and settings. See `screenshots/README.md` for captions and capture details.

The Flags and Settings screens changed after these captures. Recapture `03-flags.png` and `04-settings.png` on each device size from the final release build before uploading any set.

## How to use this pack

1. Create the app in Play Console with package name `dev.expo.kudo.japanex`.
2. Add the three store-listing languages above.
3. Paste each locale's text into the matching Main store listing fields.
4. Complete the declarations in `submission-details.md`.
5. Verify the published privacy policy at https://japanex.expo.app/privacy/ and add a monitored support email.
6. Upload the screenshots and feature graphic described in `submission-details.md`.
7. Recheck every declaration against the final production AAB before submitting for review.

Google Play listing limits and asset requirements can change. The current references used for this pack are:

- https://support.google.com/googleplay/android-developer/answer/9859152
- https://support.google.com/googleplay/android-developer/answer/9866151
- https://support.google.com/googleplay/android-developer/answer/10787469
