import React, { useMemo } from "react";
import cls from "./v2.module.scss";
import { Banner } from "interfaces";
import { Skeleton } from "@mui/material";
import AdSingle from "components/adSingle/v2";

type BannerProps = {
  data: Banner[];
  loading: boolean;
};

export default function AdsContainer({ data, loading }: BannerProps) {
  const list = useMemo(() => data.slice(0, 3), [data]);

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.bannerContainer}>
          {!loading ? (
            list.map((item) => <AdSingle key={"ads" + item.id} data={item} />)
          ) : (
            <div className={cls.shimmerContainer}>
              {Array.from(new Array(2)).map((item, idx) => (
                <Skeleton
                  key={"adsShimmer" + idx}
                  variant="rectangular"
                  className={cls.shimmer}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
