import React from "react";
import cls from "./v4.module.scss";
import useLocale from "hooks/useLocale";
import { Banner } from "interfaces";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data: Banner[];
  loading: boolean;
};

export default function BannerList({ data, loading }: Props) {
  const { t } = useLocale();

  return (
    <div className="container">
      <div className={cls.wrapper}>
        <h1 className={cls.title}>{t("offers")}</h1>
        <div className={cls.bannerContainer}>
          {!loading
            ? data.map((item) => (
                <Link
                  href={`/ads/${item.id}`}
                  key={item.id}
                  className={cls.banner}
                >
                  <div className={cls.imgWrapper}>
                    <FallbackImage
                      src={item.img}
                      alt={item.translation?.title}
                    />
                  </div>
                </Link>
              ))
            : Array.from(new Array(12)).map((item, idx) => (
                <Skeleton
                  key={"banner" + idx}
                  variant="rectangular"
                  className={cls.shimmer}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
