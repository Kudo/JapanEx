# Signed build handoff

Build from the final reviewed JapanEx worktree. The local iOS Release simulator build verifies UI behavior, but it is not a signed App Store archive. Existing EAS artifacts predate the release-readiness changes.

## Build

The `production` profile in `eas.json` increments the remote build version. EAS cloud builds may consume paid plan resources. Record the git commit and confirm the working tree you intend to upload before starting.

```sh
npx eas-cli@latest build -p ios --profile production
npx eas-cli@latest build -p android --profile production
```

Do not use `--auto-submit` for this verification round. Save each EAS build ID, version/build number, log URL, and artifact URL. If a build fails, preserve the failure log; fix the cause and create a new build rather than submitting an older artifact.

## Inspect the artifacts

1. Confirm the iOS archive has bundle ID `dev.expo.kudo.japanex`, the expected version and build number, the `applinks:japanex.expo.app` entitlement, and no development menu.
2. Confirm the Android App Bundle has package `dev.expo.kudo.japanex`, the expected version code, the verified HTTPS `/view` filter, and no unused overlay, photo, video, or storage permission in its merged manifest.
3. Install the signed builds through TestFlight and Play internal testing. Run the [native smoke test](release-readiness.md#native-smoke-test), including offline launch, read-only and confirmed-import links, accessibility, and 2048 × 2048 PNG export with flags hidden and shown. Try a long display name and check that its image label stays clear of the score.
4. Check HTTPS link handoff with the final signing certificates. A custom-scheme link or config introspection alone does not prove universal/app-link verification.
5. Recapture the final store screenshots from these builds and compare them with the submitted UI. Review the Play pre-launch report before wider rollout.

Keep the iOS and Android build IDs with the completed results in [release-readiness.md](release-readiness.md). Store submission starts only after those checks and the public support/privacy pages are verified.
