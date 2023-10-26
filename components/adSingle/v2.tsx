import React from "react";
import { Banner } from "interfaces";
import Link from "next/link";
import cls from "./v2.module.scss";
import getImage from "utils/getImage";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data: Banner;
};

export default function AdSingle({ data }: Props) {
  return (
    <Link href={`/ads/${data.id}`} className={cls.banner}>
      <div className={cls.wrapper}>
        <FallbackImage
          fill
          src={getImage(data.img)}
          alt={data.translation?.title}
          sizes="360px"
          quality={90}
          priority
        />
      </div>
    </Link>
  );
}
