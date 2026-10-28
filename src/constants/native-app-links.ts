export const APP_STORE_URL = process.env.EXPO_PUBLIC_APP_STORE_URL?.trim()
  ?? 'https://apps.apple.com/us/app/japanex/id6816584787';
export const GOOGLE_PLAY_URL = process.env.EXPO_PUBLIC_GOOGLE_PLAY_URL?.trim()
  ?? 'https://play.google.com/store/apps/details?id=dev.expo.kudo.japanex';

export const APP_STORE_ID = APP_STORE_URL?.match(
  /^https:\/\/apps\.apple\.com\/(?:[^?#]*\/)?id(\d+)(?:[/?#]|$)/,
)?.[1];
