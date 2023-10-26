import React from "react";
import { useSwiper } from "swiper/react";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import cls from "./carouselArrows.module.scss";

function NextButton() {
  const swiper = useSwiper();

  return (
    <button
      className={`${cls.btn} ${cls.next}`}
      onClick={() => swiper.slideNext()}
    >
      <ArrowRightSLineIcon />
    </button>
  );
}

function PrevButton() {
  const swiper = useSwiper();

  return (
    <button
      className={`${cls.btn} ${cls.prev}`}
      onClick={() => swiper.slidePrev()}
    >
      <ArrowLeftSLineIcon />
    </button>
  );
}

export { NextButton, PrevButton };
