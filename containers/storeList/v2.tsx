import React from "react";
import { IShop } from "interfaces";
import cls from "./v2.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Skeleton, useMediaQuery } from "@mui/material";
import StoreCard from "components/storeCard/v2";
import { NextButton } from "components/carouselArrows/carouselArrows";

const settings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "brand-list full-width",
  slidesPerView: "auto" as "auto",
  breakpoints: {
    1140: {
      slidesPerView: 8,
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
  const isMobile = useMediaQuery("(max-width:1139px)");

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
          </div>
          {!loading ? (
            <Swiper {...settings}>
              {shops.map((item) => (
                <SwiperSlide key={"store" + item.id}>
                  <StoreCard data={item} />
                </SwiperSlide>
              ))}
              {shops.length > 8 && (
                <>
                  {/* <PrevButton /> */}
                  <NextButton />
                </>
              )}
            </Swiper>
          ) : (
            <Grid container columnSpacing={isMobile ? 1 : 4}>
              {Array.from(new Array(isMobile ? 4 : 8)).map((_, idx) => (
                <Grid key={"storeShimmer" + idx} item xs={3} md={2} lg={1.5}>
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
