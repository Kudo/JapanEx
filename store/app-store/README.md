# JapanEx App Store submission draft

This pack is ready for publisher review. It has not been uploaded to App Store Connect.

## Listing copy

| App Store Connect locale | Files |
| --- | --- |
| English (U.S.) `en-US` | `listings/en-US/` |
| Japanese `ja` | `listings/ja/` |
| Chinese (Traditional) `zh-Hant` | `listings/zh-Hant/` |

Each locale has `name.txt`, `subtitle.txt`, `keywords.txt`, `description.txt`, and `release-notes.txt`. The descriptions and initial release notes are adapted from the matching Google Play draft. Names and subtitles are below 30 characters, descriptions below 4,000 characters, and keyword fields below 100 UTF-8 bytes. Recheck the final copy in App Store Connect before submission. Apple lists these field limits in its [app information](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information) and [platform version information](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) references.

## App information

| Field | Draft value or action |
| --- | --- |
| Bundle ID | `dev.expo.kudo.japanex` |
| Version | `1.0.0`; verify the signed archive's build number |
| Primary language | English (U.S.) — publisher to confirm |
| Primary category | Travel — publisher to confirm |
| Price | Free — publisher to confirm |
| Privacy policy | `https://japanex.expo.app/privacy/` |
| Support URL | `https://japanex.expo.app/support/` — live and verified on 2026-09-25; confirm contact details before entry |
| Marketing URL | `https://japanex.expo.app/` — optional |
| Support email | `kudo@csie.io` appears on the current privacy and support pages; confirm that it is monitored |
| Review login | None; the app has no account or restricted feature |

The [support page source](../../public/support/index.html) contains contact information, as required for Apple's [Support URL](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information). The deployed page returned HTTP 200 and matched the source on 2026-09-25. Apple's [App Privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy) questions and age-rating questionnaire still require publisher review against the final signed build.

Use the [App Store privacy review draft](privacy-review.md) to check source-based candidate answers and their remaining signed-build checks before publishing App Privacy responses.

## Screenshots

The app supports iPhone and iPad. Capture current UI from the final build, without fabricated progress or altered controls. Apple currently requires screenshots for a 6.9-inch iPhone display and a 13-inch iPad display when the app runs on both. Use accepted portrait sizes such as **1320 × 2868** for iPhone 17 Pro Max and **2064 × 2752** for a 13-inch iPad Pro. Apple accepts 1–10 PNG or JPEG screenshots per set and disallows alpha. Check the latest [screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications) before upload.

The [simulator draft set](screenshots/draft-simulator/) provides four English screenshots per device for layout and copy review. Capture the upload set from the final signed build after its smoke test.

Suggested sequence for each size: map with representative levels, prefecture experience picker, searchable Flags view, Settings with language and sharing controls. Capture at least the primary English set; add localized screenshots if the publisher wants the Japanese and Traditional Chinese listings to show matching UI text.

## Review notes draft

JapanEx does not require an account. The main Map tab lets reviewers tap a prefecture and choose one of six levels. The Flags tab supports search and region/level filters. Settings has language choice and Reset progress. The map, flags, and tracker work offline. Sharing a result image opens the system share sheet; a view link is read-only, and importing a shared state requires confirmation.

The publisher still needs to supply App Review contact name, email, and phone; select availability and release timing; complete content-rights, age-rating, privacy, and export-compliance answers; and upload a newly signed build. Uploading to TestFlight or App Store Connect is separate from submitting the app for public review.
