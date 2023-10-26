import React from "react";
import { IShop } from "interfaces";
import cls from "./v3.module.scss";
import ShopCard from "components/shopCard/v3";
import { Skeleton, useMediaQuery } from "@mui/material";
import Link from "next/link";
import useLocale from "hooks/useLocale";

type Props = {
  title?: string;
  featuredShops: IShop[];
  loading?: boolean;
  type: "popular" | "recomended";
};

export default function FeaturedShopsContainer({
  title,
  featuredShops,
  loading = false,
  type,
}: Props) {
  const { t } = useLocale();
  const isMobile = useMediaQuery("(max-width:1139px)");

  return (
    <section
      className="container"
      style={{
        display: !loading && featuredShops.length === 0 ? "none" : "block",
      }}
    >
      <div className={cls.container}>
        <div className={cls.header}>
          <h2 className={cls.title}>{title}</h2>
          <Link href={`/shop?filter=${type}`} className={cls.link}>
            {t("see.all")}
          </Link>
        </div>
        <div className={cls.wrapper}>
          {!loading
            ? featuredShops.map((item) => (
                <div key={"shopv3-" + item.id} className={cls.item}>
                  <ShopCard data={item} />
                </div>
              ))
            : Array.from(new Array(isMobile ? 4 : 8)).map((item, idx) => (
                <Skeleton
                  key={"shopv3-shimmer-" + idx}
                  variant="rectangular"
                  className={cls.shimmer}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
