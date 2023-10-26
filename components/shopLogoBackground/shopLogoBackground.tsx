import React from "react";
import { IShop } from "interfaces";
import cls from "./shopLogoBackground.module.scss";
import getImage from "utils/getImage";
import { Skeleton } from "@mui/material";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data?: IShop;
  size?: "small" | "medium" | "large";
  loading?: boolean;
};

export default function ShopLogoBackground({
  data,
  size = "medium",
  loading = false,
}: Props) {
  return (
    <div className={`${cls.logo} ${cls[size]}`}>
      <div className={cls.logoWrapper}>
        {!loading ? (
          <FallbackImage
            fill
            src={getImage(data?.logo_img)}
            alt={data?.translation?.title}
            sizes="(max-width: 768px) 40px, 60px"
            quality={90}
          />
        ) : (
          <Skeleton variant="rectangular" className={cls.shimmer} />
        )}
      </div>
    </div>
  );
}
