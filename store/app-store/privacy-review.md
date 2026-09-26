# App Store privacy review draft

This is a source-based draft for the publisher's App Store Connect answers, not a published declaration. Review it against the final signed iOS archive and actual network behavior before selecting or publishing answers.

## Candidate answers

| App Store Connect item | Candidate | Basis to verify |
| --- | --- | --- |
| Privacy Policy URL | `https://japanex.expo.app/privacy/` | The live page returned HTTP 200 and matched the Kudo Chien source byte for byte on 2026-09-26. |
| Data collection | **No, we do not collect data from this app** | Tracker data is stored on-device; no app-owned tracker upload or analytics call was found in the current source. The iOS EAS preview IPA contains 13 privacy manifests, all declaring no collected data. |
| Tracking | **No** | The current source includes no ads or cross-app tracking integration; those same preview IPA manifests declare tracking `false`. |
| Privacy choices URL | Leave blank unless the publisher wants a separate choices page | The policy already explains local deletion and backup limits. Apple lists this URL as optional. |

[Apple defines collection](https://developer.apple.com/app-store/app-privacy-details/) as transmitting data off-device so the developer or a third-party partner can access it longer than needed to service the request in real time. [App Store Connect requires](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy) the publisher to include relevant third-party SDK practices and keep the answers accurate. The preview IPA manifests are useful evidence, not proof of the production archive's behavior.

## App behavior behind the draft

- Experience levels, selected language, and an optional display name are saved locally. Device backups may include that database; JapanEx runs no app-owned sync service.
- A result PNG is generated locally and passed to the system share sheet only when the user requests it. A view link is assembled locally and contains the selected levels, language, and optional name in its URL. The app does not upload the snapshot when creating the link.
- A recipient who opens a shared link on the JapanEx website makes a request to Expo hosting. The [privacy policy](https://japanex.expo.app/privacy/) discloses website-hosting request data and the shareable URL contents. Confirm how the publisher treats this user-directed web visit when completing the final app-level questionnaire.
- Settings opens the privacy and support pages in the system browser. Credits and source links also open external sites when selected.

## Final review before publishing answers

1. Inspect the signed production archive's privacy report, embedded manifests, and bundled SDKs. The AdHoc preview IPA is not the store artifact.
2. Check actual outbound traffic during fresh launch, map editing, sharing, and link opening; revisit the candidate answers if a dependency sends user or device data.
3. Recheck that the deployed policy and support pages show the publisher-supplied Kudo Chien name and `support@dozastudio.dev` address, and verify that the inbox receives requests.
4. Enter the answers in App Store Connect and review the product-page privacy preview before publishing them.
