import React, { useState } from "react";
import getAvatar from "utils/getAvatar";
import { IUser } from "interfaces/user.interface";
import FallbackImage from "./fallbackImage/fallbackImage";

const avatar_placeholder = "/images/avatar_placeholder.png";

type Props = {
  data?: IUser;
};

export default function Avatar({ data }: Props) {
  const [imgSrc, setImgSrc] = useState(getAvatar(data?.img));

  return (
    <FallbackImage
      fill
      src={imgSrc}
      alt={data?.firstname}
      sizes="60px"
      onError={() => setImgSrc(avatar_placeholder)}
    />
  );
}
