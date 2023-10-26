import React from "react";
import { useSwiper } from "swiper/react";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import cls from "./parcelFeatureContainer.module.scss";

type NextProps = {
  storyNext: (swiper: any) => void;
};

function NextFeature({ storyNext }: NextProps) {
  const swiper = useSwiper();

  return (
    <button
      className={`${cls.btn} ${cls.next}`}
      onClick={() => storyNext(swiper)}
    >
      <ArrowRightSLineIcon />
    </button>
  );
}

type PrevProps = {
  storyPrev: (swiper: any) => void;
};

function PrevFeature({ storyPrev }: PrevProps) {
  const swiper = useSwiper();

  return (
    <button
      className={`${cls.btn} ${cls.prev}`}
      onClick={() => storyPrev(swiper)}
    >
      <ArrowLeftSLineIcon />
    </button>
  );
}

export { NextFeature, PrevFeature };