import { Skeleton } from "@mui/material";
import CategoryCard from "components/categoryCard/v4";
import { Category } from "interfaces";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import cls from "./v4.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type Props = {
  data?: Category[];
  loading: boolean;
  parent?: string;
};

export default function ShopCategoryList({ data, loading, parent }: Props) {
  const { t } = useTranslation();
  return (
    <div
      className="container"
      style={{ display: !loading && data?.length === 0 ? "none" : "block" }}
    >
      <Swiper
        breakpoints={{
          0: { spaceBetween: 9 },
          576: { spaceBetween: 16 },
        }}
        slidesPerView="auto"
        className={cls.slider}
      >
        {!!parent && (
          <SwiperSlide className={cls.slideItem}>
            <Link href={`/shop-category/${parent}`} shallow>
              <div className={cls.card}>
                <span className={cls.text}>{t("all")}</span>
              </div>
            </Link>
          </SwiperSlide>
        )}
        {loading
          ? Array.from(Array(10).keys()).map((item) => (
              <SwiperSlide className={cls.slideItem} key={item}>
                <Skeleton variant="rectangular" className={cls.shimmer} />
              </SwiperSlide>
            ))
          : data?.map((category) => (
              <SwiperSlide className={cls.slideItem} key={category.id}>
                <CategoryCard data={category} parent={parent} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
