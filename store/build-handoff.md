# Signed build handoff

Build from the final reviewed JapanEx worktree. Android production build 11 (`80a818f9-5486-412f-b063-2a5d34683e1f`) and iOS preview build 2 (`121ce517-5dcc-4f25-a587-e2d30b1a4054`) finished from `0405bd6`, including the image-export fix and Android filled flag icon. Build 11 replaces Android build 9, which exposed an intermittent image-export race. The iOS preview is AdHoc-signed for registered devices and is not an App Store archive. The [release readiness log](release-readiness.md) records artifact inspections and local runtime checks.

## Local gate before EAS

1. Run `bun run verify`, which includes a type-aware lint rule for unhandled Promises. Build and install a local Android Release APK (`cd android && ./gradlew :app:assembleRelease --offline`) on a fresh, disposable emulator with Wi-Fi and mobile data disabled. Run an iOS Release simulator build for changes affecting iOS.
2. Open a valid score-14 import with a 40-character display name, inspect its preview, and confirm replacement. On the first Map export, turn flags on and tap **Share result image**. Confirm the system share sheet opens and the PNG is 2048 × 2048 with the map, flags, legend, score, and a name label clear of the score.
3. Cancel the share sheet, export once more with flags on, then turn flags off and export again. Confirm each export completes without an error and the app remains usable after cancellation. Test the normal zero-score map as well. Retryable errors must be investigated before starting a paid EAS build, even when the next attempt succeeds.

The score-14 import fixture used above has 47 levels and a 40-character name:

```sh
adb shell "am start -a android.intent.action.VIEW -d 'japanex:///import?v=1&s=40000000000030000000000002200000000000000000003&l=en&n=MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' dev.expo.kudo.japanex"
```

## Build

The `production` profile in `eas.json` increments the remote build version. EAS cloud builds may consume paid plan resources. Record `git rev-parse HEAD` and confirm `git status --short` is empty before starting. Use the project-required EAS CLI version through the commands below; the older globally installed `eas` CLI does not satisfy `eas.json`.

```sh
npx eas-cli@latest build -p ios --profile production
npx eas-cli@latest build -p android --profile production
```

Do not use `--auto-submit` for this verification round. Save each new production build ID, version/build number, log URL, and artifact URL. If a build fails, preserve the failure log; fix the cause and create a new build rather than submitting an older artifact.

## Inspect the artifacts

1. Confirm the iOS archive has bundle ID `dev.expo.kudo.japanex`, the expected version and build number, the `applinks:japanex.expo.app` entitlement, and no development menu.
2. Confirm the Android App Bundle has package `dev.expo.kudo.japanex`, the expected version code, the verified HTTPS `/view` filter, and no unused overlay, photo, video, or storage permission in its merged manifest.
3. Install the signed builds through TestFlight and Play internal testing. Run the [native smoke test](release-readiness.md#native-smoke-test), including offline launch, read-only and confirmed-import links, accessibility, and 2048 × 2048 PNG export with flags hidden and shown. Try a long display name and check that its image label stays clear of the score.
4. Check HTTPS link handoff with the final signing certificates. A custom-scheme link or config introspection alone does not prove universal/app-link verification.
5. Compare the App Store and Play screenshot drafts with the delivered signed UI and recapture any mismatch. Verify the Play phone and both 9:16 tablet sets in Play Console. Review the Play pre-launch report before wider rollout.

Keep the iOS and Android build IDs with the completed results in [release-readiness.md](release-readiness.md). The live support and privacy pages show Kudo Chien and `support@dozastudio.dev`; verify inbox delivery before store submission.
