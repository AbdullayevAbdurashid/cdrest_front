import React from "react";
import { IShop } from "interfaces";
import cls from "./shopList.module.scss";
import ShopCard from "components/shopCard/shopCard";
import { Swiper, SwiperSlide } from "swiper/react";

const settings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "shop-list full-width",
  breakpoints: {
    1140: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
};

type Props = {
  title?: string;
  shops: IShop[];
};

export default function ShopListSlider({ title, shops }: Props) {
  return (
    <section className="container">
      <div className={cls.container}>
        <div className={cls.header}>
          <h2 className={cls.title}>{title}</h2>
        </div>
        <Swiper {...settings}>
          {shops.map((item) => (
            <SwiperSlide key={item.id}>
              <ShopCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
