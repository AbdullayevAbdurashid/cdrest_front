import { Story } from "interfaces";
import React from "react";
import cls from "./v4.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Skeleton } from "@mui/material";
import StoryComponent from "components/storySinglev4/storySingle";
import { Navigation } from "swiper";

type Props = {
  data?: Story[][];
  loading: boolean;
};

const storySettings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "story-swiper full-width",
  breakpoints: {
    1140: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};

export default function StoryList({ data, loading }: Props) {
  return (
    <div className="container">
      <div className={cls.storyContainer}>
        {!loading ? (
          <div className={cls.swiperContainer}>
            <Swiper
              modules={[Navigation]}
              {...storySettings}
              slidesPerView="auto"
            >
              {data?.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <StoryComponent data={item} list={data} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className={cls.shimmerContainer}>
            {Array.from(new Array(4)).map((item, idx) => (
              <Skeleton
                key={"story" + idx}
                variant="rectangular"
                className={cls.shimmer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
