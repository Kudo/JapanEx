# JapanEx App Store submission draft

The iOS production build was uploaded through EAS Submit on 2026-09-27. The listing metadata in this pack was pushed to App Store Connect through EAS Metadata and read back for verification on 2026-09-27. Promotional text was added and read back on 2026-10-11. The app has not been submitted for public App Review.

## EAS Metadata

The root [`store.config.json`](../../store.config.json) contains the English (U.S.), Japanese, and Traditional Chinese listing text from this directory, plus the public marketing, support, and privacy URLs. Update the text files and the config together when copy changes. The config leaves out fields that still need a publisher decision: App Review contact, age rating, category, and release timing. It also omits `releaseNotes`, because Apple's **What's New** field is unavailable for a first version; keep the text files as drafts for a later update.

The EAS Submit record is `29d7debf-f3c8-4b88-9042-a636a9f3826c` for iOS production build `eb88ae0a-d283-4d17-83c4-1ff2107238a3` (`1.0.0`, build `3`). The store config pins `apple.version` to `1.0.0`, matching the uploaded binary. The first metadata push without this value failed because EAS sent an empty `versionString`. A retry updated the version and created the Japanese and Traditional Chinese locales. New locales received only app-info fields on that pass, so a second push filled their description, keywords, marketing URL, and support URL. A subsequent metadata pull matched the local config for all seven checked fields in all three locales, plus the version and copyright.

On 2026-10-11, `promoText` was added for `en-US`, `ja`, and `zh-Hant`. EAS Metadata lint found no issues, the push completed, and a fresh pull matched all three promotional texts exactly. The source copy is in each locale's `promotional-text.txt`.

For later listing edits, run `npx eas-cli@latest metadata:lint --json`, then `npx eas-cli@latest metadata:push`. Pull the store state or review App Store Connect after the push, especially when adding a locale. EAS Metadata currently supports Apple only and does not upload screenshots or complete every App Store submission field. The [Expo guide](https://docs.expo.dev/deploy/app-stores-metadata/) requires a submitted and processed binary before pushing metadata.

Test plan: check title, subtitle, promotional text, description, and keywords in each locale; confirm all three URLs open; inspect the final signed build and screenshots; verify the age-rating and privacy answers; then check App Store Connect for missing or rejected fields after the push. If lint or push reports an error, fix the named field and rerun lint before retrying the push. For this upload, EAS lint returned no issues, all three public URLs returned HTTP 200, and the post-push pull matched every field in the config.

## Listing copy

| App Store Connect locale | Files |
| --- | --- |
| English (U.S.) `en-US` | `listings/en-US/` |
| Japanese `ja` | `listings/ja/` |
| Chinese (Traditional) `zh-Hant` | `listings/zh-Hant/` |

Each locale has `name.txt`, `subtitle.txt`, `promotional-text.txt`, `keywords.txt`, `description.txt`, and `release-notes.txt`. The descriptions and initial release notes are adapted from the matching Google Play draft. Names and subtitles are below 30 characters, promotional texts below 170 characters, descriptions below 4,000 characters, and keyword fields below 100 UTF-8 bytes. Recheck the final copy in App Store Connect before submission. Apple lists these field limits in its [app information](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information) and [platform version information](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) references.

## App information

| Field | Draft value or action |
| --- | --- |
| Bundle ID | `dev.expo.kudo.japanex` |
| Developer / publisher | Kudo Chien — supplied by publisher on 2026-09-26 |
| Version | `1.0.0`; verify the signed archive's build number |
| Primary language | English (U.S.) — publisher to confirm |
| Primary category | Travel — publisher to confirm |
| Price | Free — publisher to confirm |
| Privacy policy | `https://japanex.expo.app/privacy/` |
| Support URL | `https://japanex.expo.app/support/` — live page verified with current contact details |
| Marketing URL | `https://japanex.expo.app/` — optional |
| Support email | `kudo@csie.io` — supplied by publisher; verify delivery before submission |
| Review login | None; the app has no account or restricted feature |

The [support page source](../../public/support/index.html) contains contact information, as required for Apple's [Support URL](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information). The deployed page returned HTTP 200 on 2026-09-26 and matched the Kudo Chien source byte for byte. Apple's [App Privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy) questions and age-rating questionnaire still require publisher review against the final signed build.

Use the [App Store privacy review draft](privacy-review.md) to check source-based candidate answers and their remaining signed-build checks before publishing App Privacy responses.

## Screenshots

The app supports iPhone and iPad. Capture current UI without fabricated progress or altered controls. Apple currently requires screenshots for a 6.9-inch iPhone display and a 13-inch iPad display when the app runs on both. Use accepted portrait sizes such as **1320 × 2868** for iPhone 17 Pro Max and **2064 × 2752** for a 13-inch iPad Pro. Apple accepts 1–10 PNG or JPEG screenshots per set and disallows alpha. Simulator captures are permitted; compare them with the final signed build before upload and recapture if its UI differs. See Apple's [screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications) and [Xcode capture guidance](https://developer.apple.com/documentation/xcode/capturing-screenshots-and-videos-from-devices).

The [simulator draft set](screenshots/draft-simulator/) provides four English screenshots per device for layout and copy review. Check this set against the final signed build after its smoke test.

Suggested sequence for each size: map with representative levels, prefecture experience picker, searchable Flags view, Settings with language and sharing controls. Capture at least the primary English set; add localized screenshots if the publisher wants the Japanese and Traditional Chinese listings to show matching UI text.

## Review notes draft

JapanEx does not require an account. The main Map tab lets reviewers tap a prefecture and choose one of six levels. The Flags tab supports search and region/level filters. Settings has language choice and Reset progress. The map, flags, and tracker work offline. Sharing a result image opens the system share sheet; a view link is read-only, and importing a shared state requires confirmation.

The publisher confirmed App Review contact name Kudo Chien and email `kudo@csie.io`; Apple still requires a phone number in international format. The publisher also needs to select availability and release timing; complete content-rights, age-rating, privacy, and export-compliance answers; and verify the newly uploaded signed build. Uploading to TestFlight or App Store Connect is separate from submitting the app for public review.
