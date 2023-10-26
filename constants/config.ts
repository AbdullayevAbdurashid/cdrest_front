// Firebase config
export const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
export const AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
export const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
export const MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
export const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
export const MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// Default config
export const DEFAULT_LOCATION = process.env.NEXT_PUBLIC_DEFAULT_LOCATION; // latitude,longitude
export const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;

// SEO
export const META_TITLE = process.env.NEXT_PUBLIC_META_TITLE;
export const META_DESCRIPTION = process.env.NEXT_PUBLIC_META_DESCRIPTION;
export const META_IMAGE = process.env.NEXT_PUBLIC_META_IMAGE;
export const META_KEYWORDS = process.env.NEXT_PUBLIC_META_KEYWORDS;
export const BRAND_LOGO = process.env.NEXT_PUBLIC_LOGO;
export const BRAND_LOGO_DARK = process.env.NEXT_PUBLIC_LOGO_DARK;
export const BRAND_LOGO_ROUNDED = process.env.NEXT_PUBLIC_LOGO_ROUNDED;

// Dynamic Link
export const DYNAMIC_LINK_DOMAIN = process.env.NEXT_PUBLIC_DYNAMIC_LINK_DOMAIN;
export const DYNAMIC_LINK_ANDROID =
  process.env.NEXT_PUBLIC_DYNAMIC_LINK_ANDROID_PACKAGE_NAME;
export const DYNAMIC_LINK_IOS =
  process.env.NEXT_PUBLIC_DYNAMIC_LINK_IOS_BUNDLE_ID;
export const DYNAMIC_LINK_WEB_KEY = process.env.NEXT_PUBLIC_FIREBASE_WEB_KEY

export const defaultUser = {
  login: 'user@githubit.com',
  password: 'githubit'
}
