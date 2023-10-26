import { DEFAULT_LANGUAGE } from "constants/config";

export default function getLanguage(lang?: string) {
  return lang || DEFAULT_LANGUAGE;
}
