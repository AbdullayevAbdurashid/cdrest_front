import { Skeleton } from "@mui/material";
import BrandShopCard from "components/brandShopCard/v4";
import { IShop } from "interfaces";
import React from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import cls from "./v4.module.scss";

type Props = {
  data?: IShop[];
  loading: boolean;
};

export default function BrandShopList({ data, loading }: Props) {
  return (
    <div className={cls.list}>
      <div className="container">
        <Swiper
          navigation
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={30}
          breakpoints={{ 0: { spaceBetween: 10 }, 576: { spaceBetween: 30 } }}
        >
          {loading
            ? Array.from(Array(10).keys()).map((item) => (
                <SwiperSlide className={cls.listItem} key={item}>
                  <Skeleton className={cls.shimmer} variant="rectangular" />
                </SwiperSlide>
              ))
            : data?.map((shop) => (
                <SwiperSlide key={shop.id} className={cls.listItem}>
                  <BrandShopCard data={shop} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
}
