import React, { useEffect } from "react";
import cls from "./parcelFeatureItem.module.scss";
import { IParcelFeature } from "interfaces";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import FeatureLine from "./featureLine";
import useTimer from "hooks/useTimer";
import { STORY_DURATION } from "constants/story";
import { useSwiper } from "swiper/react";

type Props = {
  data: IParcelFeature;
  handleClose: () => void;
  storiesLength: number;
  currentIndex: number;
  storyNext: (swiper: any) => void;
};

export default function ParcelFeatureItem({
  data,
  handleClose,
  storiesLength,
  currentIndex,
  storyNext,
}: Props) {
  const { t } = useTranslation();
  const time = useTimer(STORY_DURATION);
  const swiper = useSwiper();

  useEffect(() => {
    if (!time) {
      storyNext(swiper);
    }
  }, [time]);

  return (
    <div className={cls.story}>
      <div className={cls.header}>
        <div className={cls.stepper}>
          {Array.from(new Array(storiesLength)).map((_, idx) => (
            <FeatureLine
              key={"line" + idx}
              time={time}
              lineIdx={idx}
              currentIdx={currentIndex}
              isBefore={currentIndex > idx}
            />
          ))}
        </div>
        <div className={cls.flex}>
          <div className={cls.shop}>
          
          </div>
          <button type="button" className={cls.closeBtn} onClick={handleClose}>
            <CloseFillIcon />
          </button>
        </div>
      </div>
      <Image
        fill
        src={data.img}
        alt={data.title}
        sizes="511px"
        quality={90}
        priority
        className={cls.storyImage}
      />
      <div className={cls.title}>{data.title}</div>
    </div>
  );
}