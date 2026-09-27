# Google Play submission details

This document separates facts verified from the repository from publisher-owned details that must be confirmed in Play Console.

## App identity

| Field | Value |
| --- | --- |
| App name | JapanEx |
| Developer / publisher | Kudo Chien — supplied by publisher on 2026-09-26 |
| Default language | English (United States) |
| App or game | App |
| Package name | `dev.expo.kudo.japanex` |
| Version name | `1.0.0` |
| Pricing | Free — confirm with publisher |
| Category | Travel & Local |
| Website | https://japanex.expo.app |
| Privacy policy URL | https://japanex.expo.app/privacy/ — redeploy the revised `kudo@csie.io` contact and verify the live page before submission |
| Support email | `kudo@csie.io` — supplied by publisher; verify delivery before submission |
| Support phone | Optional |

For tags, open Play Console's suggested tags and select no more than five that are visibly supported by the listing and initial app experience. Prefer travel-map, travel-planning, or trip-recording tags if Google offers them; do not select navigation because JapanEx does not provide routes or live location.

## App content declarations

These suggested answers are based on the current source and must be rechecked against the final production AAB and Play Console's exact wording.

| Declaration | Suggested answer | Evidence / note |
| --- | --- | --- |
| Ads | No | No advertising SDK or ad UI is present. |
| App access | All functionality is available without special access | No login, membership, or restricted section exists. |
| Target audience | Ages 13 and over | The app is suitable for broad use but is not specifically designed for children. Confirm the publisher's intended audience. |
| News app | No | The app does not publish news. |
| Government app | No | It is an independent travel tracker. It displays attributed prefecture insignia but does not represent a government entity. |
| Health features | No | No health functionality is present. |
| Financial features | No | No financial functionality is present. |
| COVID-19 contact tracing or status | No | No related functionality is present. |
| Account creation | No | No user account exists, so an account-deletion flow is not applicable. |
| Content rating category | Utility, productivity, communication, or other | Answer all objectionable-content questions "No" based on the bundled app content. The final rating is assigned by IARC. |
| User-generated content | No hosted UGC | Users may enter an optional name and share a generated image or encoded view link through Android's share sheet, but JapanEx does not host a public content feed. Verify against the questionnaire wording. |

## Data safety draft

Candidate top-level answers from the current source, to be confirmed against the signed production AAB and actual network behavior:

- Does the app collect or share any required user data types? **No.**
- Is all user data encrypted in transit? **Not applicable**, because the app itself does not transmit user data to a developer-controlled backend.
- Can users request deletion? **Not applicable to server data.** Users can clear locally stored progress with **Settings → Reset progress** or uninstall the app.
- Privacy policy: **Required**, even for an app that declares no collection or sharing.

Implementation facts supporting those answers:

- Experience levels, locale, and the optional display name are stored in the app's local SQLite database. Android or iOS may include that database in a user-enabled device backup; JapanEx does not operate a sync or backup server.
- JapanEx has no account system, backend API, ads, analytics, crash-reporting SDK, or third-party sign-in.
- The optional display name and experience levels are encoded into a view URL only after the user chooses to copy or share that link.
- A result PNG is generated in the app cache and sent to Android's system share sheet only after the user chooses to share it.
- The app reads the device locale to select an initial interface language. It does not send the locale off-device.

Google's [Data safety instructions](https://support.google.com/googleplay/android-developer/answer/10787469) distinguish on-device processing from collection, and exclude a transfer from the "shared" declaration when it follows a specific user action that reasonably implies sharing. The current image and link sharing flows fit that description, but the publisher must answer Play Console's current form against the signed build and the published privacy policy. Re-audit dependencies and the final manifest whenever analytics, crash reporting, cloud sync, accounts, or another networked SDK is added.

## Permission review before submission

JapanEx does not browse, import, or save to the user's photo library. The Expo config blocks Android storage and media permissions, including `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_EXTERNAL_STORAGE`, and `WRITE_EXTERNAL_STORAGE`. The merged manifest in production AAB build 9 requests no photo, video, or storage permission. Build 9 contains the superseded image-export race; inspect its replacement production AAB before upload.

## Store assets

### Required

| Asset | Specification | Status |
| --- | --- | --- |
| Play Store icon | 512 × 512 px, 32-bit PNG | Ready at `assets/app-icon.png` |
| Feature graphic | 1024 × 500 px, JPEG or 24-bit PNG without alpha | Ready in English, Japanese, and Traditional Chinese under `assets/` |
| Phone screenshots | At least 2; use at least 4 portrait 1080 × 1920 px screenshots for recommendation eligibility | Four current local Release drafts under `screenshots/phone/en-US/` |
| 7-inch tablet screenshots | 9:16 portrait PNG captures of the tablet layout | Four 1080 × 1920 local Release drafts under `screenshots/7-inch-tablet/en-US/` |
| 10-inch tablet screenshots | 9:16 portrait PNG captures of the tablet layout | Four 1440 × 2560 local Release drafts under `screenshots/10-inch-tablet/en-US/` |

Google Play accepts up to eight screenshots per supported device type. These three English sets were captured from the current local Release APK with the same representative on-device progress. Check them against the final signed build before upload.

### Recommended phone screenshot sequence

1. Interactive map with several experience levels selected
   - Alt text: `A color-coded map of Japan showing experience levels for all 47 prefectures.`
2. Hokkaido detail and selected experience level
   - Alt text: `The Hokkaido prefectural flag and its selected travel experience level.`
3. Searchable prefecture flag gallery
   - Alt text: `A searchable gallery displaying Japanese prefecture flags and experience levels.`
4. Settings and language selection
   - Alt text: `JapanEx settings with display name, language, and view-link sharing controls.`

Use actual in-app screens without device frames. Keep any added tagline under 20% of the image, localize overlays for each listing language, and do not add rankings, awards, price promotions, or calls to install.

### Feature graphics

The localized upload-ready files use the app's navy background and warm accent colors, with an expanded Japan map kept in the safe area:

- English: `assets/feature-graphic-en-US.png` — `Map your journey across Japan`
- Japanese: `assets/feature-graphic-ja-JP.png` — `日本での経験を地図に残そう`
- Traditional Chinese: `assets/feature-graphic-zh-TW.png` — `把日本足跡留在地圖上`

Use `assets/feature-graphic-base.png` as the text-free master if another localization is added.

## Before review

- Verify that `kudo@csie.io` receives support and privacy requests; recheck that the deployed support and privacy pages show this address and Kudo Chien.
- Confirm that the published privacy policy URL still loads publicly without authentication or an editable document UI.
- Inspect the replacement production AAB's merged manifest and confirm that no photo, video, or storage permission is present.
- Compare the twelve local Release screenshot drafts with the final Play-signed build; recapture any screen whose delivered UI differs. Verify all three sets in Play Console before upload.
- Upload localized listing text, release notes, screenshots, app icon, and the matching localized feature graphic.
- Complete Data safety, Ads, App access, Target audience, Content rating, and all other dashboard declarations.
- Run the production build through internal testing and review its pre-launch report.
- Confirm the deployed `public/.well-known/assetlinks.json` continues to match the Play App Signing SHA-256 certificate.
