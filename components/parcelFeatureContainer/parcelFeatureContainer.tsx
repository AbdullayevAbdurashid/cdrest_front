import React, { useState } from "react";
import cls from "./parcelFeatureContainer.module.scss";
import { DialogProps } from "@mui/material";
import StoryModal from "components/parcelFeatureModal/parcelFeatureModal";
import { IParcelFeature, Story } from "interfaces";
import StoryItem from "components/parcelFeatureItem/parcelFeatureItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { PrevFeature, NextFeature } from "./featureButtons";
import Loading from "components/loader/loading";

interface Props extends DialogProps {
  stories: IParcelFeature[][];
}

export default function ParcelFeatureContainer({ stories, ...rest }: Props) {
  const [index, setIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const isPrevStoryAvailable = 1 < index + 1;
  const isNextStoryAvailable = (storiesLength: number) =>
    storiesLength > index + 1;

  const storyNext = () => {
    if (isNextStoryAvailable(stories[swiperRef?.activeIndex || 0].length)) {
      setIndex(index + 1);
    } else {
      swiperRef?.slideNext();
    }
  };

  const storyPrev = () => {
    if (isPrevStoryAvailable) {
      setIndex(index - 1);
    } else {
      swiperRef?.slidePrev();
    }
  };

  return (
    <StoryModal {...rest}>
      <div className={cls.wrapper}>
        <Swiper
          preloadImages={true}
          className="story"
          onSlideChange={() => setIndex(0)}
          onSwiper={setSwiperRef}
        >
          {stories?.map((item, idx) => (
            <SwiperSlide key={"story" + idx}>
              {({ isActive }) =>
                isActive && item[index] ? (
                  <StoryItem
                    key={item[index].id}
                    data={item[index]}
                    currentIndex={index}
                    storiesLength={item.length}
                    handleClose={() => {
                      if (rest.onClose) rest.onClose({}, "backdropClick");
                    }}
                    storyNext={storyNext}
                  />
                ) : (
                  <div className={cls.loading}>
                    <Loading />
                  </div>
                )
              }
            </SwiperSlide>
          ))}
        </Swiper>
        <PrevFeature storyPrev={storyPrev} />
        <NextFeature storyNext={storyNext} />
      </div>
    </StoryModal>
  );
}