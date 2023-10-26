import { IMAGE_URL } from "constants/constants";
const avatar_placeholder = "/images/avatar_placeholder.png";

export default function getAvatar(img?: string) {
  if (img) {
    return img.includes("http") ? img : IMAGE_URL + img;
  } else {
    return avatar_placeholder;
  }
}
