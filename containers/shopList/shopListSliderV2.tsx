import React, { useState } from "react";
import { IShop } from "interfaces";
import cls from "./v2.module.scss";
import ShopCard from "components/shopCard/v2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import Link from "next/link";
import useLocale from "hooks/useLocale";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";

const settings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "shop-list full-width",
  slidesPerView: 'auto' as 'auto',
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
  type: "popular" | "recomended";
};

export default function ShopListSlider({ title, shops, type }: Props) {
  const { t } = useLocale();
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();

  const storyNext = () => {
    swiperRef?.slideNext();
  };
  const storyPrev = () => {
    swiperRef?.slidePrev();
  };

  return (
    <div className={cls.wrapper}>
      <section className="container">
        <div className={cls.container}>
          <div className={cls.header}>
            <h2 className={cls.title}>{title}</h2>
            <div className={cls.actions}>
              <Link href={`/shop?filter=${type}`} className={cls.link}>
                {t("see.all")}
              </Link>
              {shops.length > 4 && (
                <div className={cls.arrows}>
                  <button className={cls.btn} onClick={storyPrev}>
                    <ArrowLeftSLineIcon />
                  </button>
                  <button className={cls.btn} onClick={storyNext}>
                    <ArrowRightSLineIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
          <Swiper {...settings} onSwiper={setSwiperRef}>
            {shops.map((item) => (
              <SwiperSlide key={"shop" + item.id}>
                <ShopCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}
