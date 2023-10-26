import React from "react";
import cls from "./v2.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Banner, Story } from "interfaces";
import StoryComponent from "components/storySingle/v2";
import BannerSingle from "components/bannerSingle/v2";
import { Skeleton, useMediaQuery } from "@mui/material";
import useLocale from "hooks/useLocale";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";

const bannerSettings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "banner-swiper full-width",
  breakpoints: {
    1140: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
  },
};

const storySettings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "story-swiper full-width",
  breakpoints: {
    1140: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
};

type BannerProps = {
  stories?: Story[][];
  banners: Banner[];
  loadingStory: boolean;
  loadingBanner: boolean;
  bannerCount?: number;
};

export default function BannerContainer({
  stories,
  banners,
  loadingStory,
  loadingBanner,
  bannerCount = 0,
}: BannerProps) {
  const { t } = useLocale();
  const isMobile = useMediaQuery("(max-width:1139px)");

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.header}>
          <h1 className={cls.title}>{t("offers")}</h1>
          <Link href="/promotion" className={cls.link}>
            {t("see.all")}
          </Link>
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
              </Swiper>
            ) : (
              <div className={cls.shimmerContainer}>
                {Array.from(new Array(isMobile ? 3 : 4)).map((item, idx) => (
                  <Skeleton
                    key={"story" + idx}
                    variant="rectangular"
                    className={cls.shimmer}
                  />
                ))}
              </div>
            )}
          </div>
          {!loadingStory && !!stories?.length && <div className={cls.space} />}
          <div className={cls.bannerContainer}>
            {!loadingBanner ? (
              <Swiper {...bannerSettings} slidesPerView="auto">
                {banners.map((item) => (
                  <SwiperSlide key={item.id}>
                    <BannerSingle data={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className={cls.shimmerContainer}>
                {Array.from(new Array(2)).map((item, idx) => (
                  <Skeleton
                    key={"banner" + idx}
                    variant="rectangular"
                    className={cls.shimmer}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={cls.actions}>
            <Link href="/promotion" className={cls.moreBtn}>
              <div className={cls.icon}>
                <ArrowRightSLineIcon />
              </div>
              <p className={cls.text}>{t("view.all")}</p>
              <p className={cls.muted}>
                {t("number.of.offers", { number: bannerCount })}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
