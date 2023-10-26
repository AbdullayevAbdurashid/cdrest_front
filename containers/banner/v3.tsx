import React from "react";
import cls from "./v3.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Story } from "interfaces";
import StoryComponent from "components/storySingle/v3";
import { Skeleton, useMediaQuery } from "@mui/material";
import useLocale from "hooks/useLocale";
import { NextButton } from "components/carouselArrows/carouselArrows";

const storySettings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "story-swiper-v3 full-width",
  breakpoints: {
    1140: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  },
};

type BannerProps = {
  stories?: Story[][];
  loadingStory: boolean;
};

export default function BannerContainer({
  stories,
  loadingStory,
}: BannerProps) {
  const { t } = useLocale();
  const isMobile = useMediaQuery("(max-width:1139px)");

  return (
    <div
      className={cls.container}
      style={{
        display: !loadingStory && stories?.length === 0 ? "none" : "block",
      }}
    >
      <div className="container">
        <div className={cls.header}>
          <h1 className={cls.title}>{t("offers")}</h1>
        </div>
        <div className={cls.banner}>
          <div className={cls.storyContainer}>
            {!loadingStory ? (
              <Swiper {...storySettings} slidesPerView="auto">
                {stories?.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <StoryComponent data={item} list={stories} />
                  </SwiperSlide>
                ))}
                {Number(stories?.length) > 5 && <NextButton />}
              </Swiper>
            ) : (
              <div className={cls.shimmerContainer}>
                {Array.from(new Array(isMobile ? 2 : 5)).map((item, idx) => (
                  <Skeleton
                    key={"storyv3-" + idx}
                    variant="rectangular"
                    className={cls.shimmer}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
