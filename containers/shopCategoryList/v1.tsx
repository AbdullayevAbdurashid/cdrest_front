import { Skeleton } from "@mui/material";
import CategoryCard from "components/categoryCard/v1";
import { Category } from "interfaces";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import cls from "./v1.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Navigation } from "swiper";

type Props = {
  data?: Category[];
  loading: boolean;
  parent?: string;
};

export default function ShopCategoryList({ data, loading, parent }: Props) {
  const { t } = useTranslation();
  return (
    <div className={cls.container}>
      <div
        className="container"
        style={{
          display: !loading && data?.length === 0 ? "none" : "block",
          background: "var(primary-bg)",
        }}
      >
        <Swiper
          breakpoints={{
            0: { spaceBetween: 9, slidesPerView: 2.5 },
            440: { slidesPerView: 3.5 },
            576: { spaceBetween: 16, slidesPerView: 5 },
            768: { slidesPerView: 7 },
            992: { slidesPerView: 8.5 },
            1200: { slidesPerView: 10 },
          }}
          className={`${cls.slider} full-width`}
          modules={[Navigation]}
          navigation
          spaceBetween={10}
        >
          {!!parent && (
            <SwiperSlide style={{ maxWidth: "max-content" }}>
              <Link href={`/shop-category/${parent}`} shallow>
                <div className={cls.card}>
                  <span className={cls.text}>{t("all")}</span>
                </div>
              </Link>
            </SwiperSlide>
          )}
          {loading
            ? Array.from(Array(10).keys()).map((item) => (
                <SwiperSlide key={item}>
                  <Skeleton variant="rectangular" className={cls.shimmer} />
                </SwiperSlide>
              ))
            : data?.map((category) => (
                <SwiperSlide key={category.id}>
                  <CategoryCard data={category} parent={parent} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
}
