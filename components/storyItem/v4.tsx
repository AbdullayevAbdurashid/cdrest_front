import React, { useEffect } from "react";
import cls from "./v4.module.scss";
import { Story } from "interfaces";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import StoryLine from "./storyLinev4";
import useTimer from "hooks/useTimer";
import { STORY_DURATION } from "constants/story";
import { useSwiper } from "swiper/react";
import { useRouter } from "next/router";
import getStoryImage from "utils/getStoryImage";

type Props = {
  data: Story;
  handleClose: () => void;
  storiesLength: number;
  currentIndex: number;
  storyNext: (swiper: any) => void;
};

export default function StoryItem({
  data,
  handleClose,
  storiesLength,
  currentIndex,
  storyNext,
}: Props) {
  const { t } = useTranslation();
  const time = useTimer(STORY_DURATION);
  const swiper = useSwiper();
  const { push } = useRouter();

  useEffect(() => {
    if (!time) {
      storyNext(swiper);
    }
  }, [time]);

  const goToOrder = () => {
    push(
      `/restaurant/${data.shop_id}?product=${data.product_uuid}`,
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className={cls.story}>
      <div className={cls.header}>
        <div className={cls.stepper}>
          {Array.from(new Array(storiesLength)).map((_, idx) => (
            <StoryLine
              key={"line" + idx}
              time={time}
              lineIdx={idx}
              currentIdx={currentIndex}
              isBefore={currentIndex > idx}
            />
          ))}
        </div>
        <div className={cls.flex}>
          <div className={cls.shop}></div>
          <button type="button" className={cls.closeBtn} onClick={handleClose}>
            <CloseFillIcon />
          </button>
        </div>
      </div>
      <Image
        fill
        src={getStoryImage(data.url)}
        alt={data.title}
        sizes="511px"
        quality={90}
        priority
        className={cls.storyImage}
      />
      <div className={cls.title}>{data.product_title}</div>
    </div>
  );
}
