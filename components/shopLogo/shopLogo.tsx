import React from "react";
import { IShop } from "interfaces";
import cls from "./shopLogo.module.scss";
import getImage from "utils/getImage";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data: IShop;
  size?: "small" | "medium" | "large";
};

export default function ShopLogo({ data, size = "medium" }: Props) {
  return (
    <div className={`${cls.logo} ${cls[size]}`}>
      <span className={cls.wrapper}>
        <FallbackImage
          fill
          src={getImage(data.logo_img)}
          alt={data.translation?.title}
          sizes="(max-width: 768px) 40px, 60px"
          quality={90}
        />
      </span>
    </div>
  );
}
