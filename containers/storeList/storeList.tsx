import React from "react";
import { IShop } from "interfaces";
import cls from "./storeList.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Skeleton } from "@mui/material";
import StoreCard from "components/storeCard/storeCard";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import useLocale from "hooks/useLocale";
import { useTheme } from "contexts/theme/theme.context";

const settings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "shop-list full-width",
  slidesPerView: "auto" as "auto",
  breakpoints: {
    1140: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  },
};

type Props = {
  title?: string;
  shops: IShop[];
  loading?: boolean;
};

export default function StoreList({ title, shops, loading }: Props) {
  const { t } = useLocale();
  const { direction } = useTheme();

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
            <Link href="/shop" className={cls.link}>
              <span className={cls.text}>{t("see.all")}</span>
              {direction === "rtl" ? (
                <ArrowLeftSLineIcon />
              ) : (
                <ArrowRightSLineIcon />
              )}
            </Link>
          </div>
          {!loading ? (
            <Swiper {...settings}>
              {shops.map((item) => (
                <SwiperSlide key={item.id}>
                  <StoreCard data={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Grid container columnSpacing={4}>
              {Array.from(new Array(5)).map((_, idx) => (
                <Grid key={"store" + idx} item xs={12} md={4} lg={2.4}>
                  <Skeleton variant="rectangular" className={cls.shimmer} />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </section>
    </div>
  );
}
