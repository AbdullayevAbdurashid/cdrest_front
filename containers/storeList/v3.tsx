import React, { useMemo } from "react";
import { Banner, IShop } from "interfaces";
import cls from "./v3.module.scss";
import { Skeleton, useMediaQuery } from "@mui/material";
import StoreCard from "components/storeCard/v3";
import Link from "next/link";
import useLocale from "hooks/useLocale";
import AdSingle from "components/adSingle/v3";

type Props = {
  title?: string;
  shops: IShop[];
  loading?: boolean;
  ads: Banner[];
};

export default function StoreList({ title, shops, loading, ads }: Props) {
  const { t } = useLocale();
  const isMobile = useMediaQuery("(max-width:1139px)");

  const list = useMemo(() => {
    if (isMobile) {
      return shops.slice(0, 8);
    }
    return shops;
  }, [shops, isMobile]);

  return (
    <div className={cls.container}>
      <section
        className="container"
        style={{
          display: !loading && shops.length === 0 ? "none" : "block",
        }}
      >
        <div className={cls.wrapper}>
          <div className={cls.header}>
            <h2 className={cls.title}>{title}</h2>
            <Link href="/brands" className={cls.link}>
              {t("see.all")}
            </Link>
          </div>
          <div className={cls.grid}>
            {!loading
              ? list.map((item) => (
                  <StoreCard key={"store" + item.id} data={item} />
                ))
              : Array.from(new Array(isMobile ? 8 : 12)).map((_, idx) => (
                  <Skeleton
                    key={"storeShimmer" + idx}
                    variant="rectangular"
                    className={cls.shimmer}
                  />
                ))}

            {!loading &&
              ads.map((item) => (
                <div key={"ads-v3-" + item.id} className={cls.gridItem}>
                  <AdSingle data={item} />
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
