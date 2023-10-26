import React, { useState } from "react";
import { IShop } from "interfaces";
import cls from "./featuredShopsContainer.module.scss";
import ShopHeroCard from "components/shopHeroCard/shopHeroCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Skeleton } from "@mui/material";
import { Swiper as SwiperClass } from "swiper/types";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";

const settings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "featured-shops full-width",
  breakpoints: {
    1140: {
      slidesPerView: 6,
      spaceBetween: 30,
    },
  },
};

type Props = {
  title?: string;
  featuredShops: IShop[];
  loading?: boolean;
};

export default function FeaturedShopsContainer({
  title,
  featuredShops,
  loading = false,
}: Props) {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();

  const storyNext = () => {
    swiperRef?.slideNext();
  };
  const storyPrev = () => {
    swiperRef?.slidePrev();
  };

  return (
    <section
      className="container"
      style={{
        display: !loading && featuredShops.length === 0 ? "none" : "block",
      }}
    >
      <div className={cls.container}>
        <div className={cls.header}>
          <h2 className={cls.title}>{title}</h2>
          {featuredShops.length > 6 && (
            <div className={cls.actions}>
              <button className={cls.btn} onClick={storyPrev}>
                <ArrowLeftSLineIcon />
              </button>
              <button className={cls.btn} onClick={storyNext}>
                <ArrowRightSLineIcon />
              </button>
            </div>
          )}
        </div>
        {!loading ? (
          <Swiper {...settings} slidesPerView="auto" onSwiper={setSwiperRef}>
            {featuredShops.map((item) => (
              <SwiperSlide key={item.id}>
                <ShopHeroCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className={cls.shimmerContainer}>
            {Array.from(new Array(6)).map((item, idx) => (
              <Skeleton
                key={"recomended" + idx}
                variant="rectangular"
                className={cls.shimmer}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
