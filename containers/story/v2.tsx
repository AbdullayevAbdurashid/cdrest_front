import React, { useState } from "react";
import cls from "./v2.module.scss";
import { DialogProps } from "@mui/material";
import StoryModal from "components/storyModal/v2";
import { Story } from "interfaces";
import StoryItem from "components/storyItem/v2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { NextStory, PrevStory } from "./storyButtons";
import Loading from "components/loader/loading";
import StoryMenu from "components/storyMenu/storyMenu";

interface Props extends DialogProps {
  stories: Story[][];
}

export default function StoryContainer({ stories, ...rest }: Props) {
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

  const goToStory = (index: number) => {
    swiperRef?.slideTo(index);
  };

  return (
    <StoryModal {...rest}>
      <StoryMenu
        stories={stories}
        handleSelect={goToStory}
        handleClose={() => {
          if (rest.onClose) rest.onClose({}, "backdropClick");
        }}
      />
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
                    key={item[index].url}
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
        <PrevStory storyPrev={storyPrev} />
        <NextStory storyNext={storyNext} />
      </div>
    </StoryModal>
  );
}
