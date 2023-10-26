import React from "react";
import cls from "./v3.module.scss";
import useLocale from "hooks/useLocale";
import Link from "next/link";
import { Category } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { Skeleton, Grid, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { NextButton } from "components/carouselArrows/carouselArrows";

const settings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "category-list-v3 full-width",
  slidesPerView: "auto" as "auto",
  breakpoints: {
    1140: {
      slidesPerView: 8,
      spaceBetween: 30,
    },
  },
};

type Props = {
  categories?: Category[];
  loading?: boolean;
  hasNextPage?: boolean;
};

export default function CategoryContainer({
  categories = [],
  loading,
  hasNextPage,
}: Props) {
  const { t } = useLocale();
  const isMobile = useMediaQuery("(max-width:1139px)");

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.header}>
          <h1 className={cls.title}>{t("categories")}</h1>
          {hasNextPage && (
            <Link href="/shop-category" className={cls.link}>
              {t("see.all")}
            </Link>
          )}
        </div>
        <div className={cls.wrapper}>
          {!loading ? (
            <Swiper {...settings}>
              {categories.map((item) => (
                <SwiperSlide key={"store" + item.id}>
                  <Link
                    key={item.uuid}
                    href={`/shop-category/${item.uuid}`}
                    className={cls.item}
                  >
                    <div className={cls.imgWrapper}>
                      <div className={cls.img}>
                        <FallbackImage
                          src={item.img}
                          alt={item.translation?.title}
                        />
                      </div>
                    </div>
                    <div className={cls.body}>
                      <span className={cls.text}>
                        {item.translation?.title}
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
              {Number(categories?.length) > 8 && <NextButton />}
            </Swiper>
          ) : (
            <Grid container columnSpacing={isMobile ? 1 : 4}>
              {Array.from(new Array(isMobile ? 4 : 8)).map((_, idx) => (
                <Grid key={"categoryShimmer" + idx} item xs={3} md={2} lg={1.5}>
                  <Skeleton variant="rectangular" className={cls.shimmer} />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </div>
    </div>
  );
}
