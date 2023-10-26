import React, { useEffect } from "react";
import cls from "./storyItem.module.scss";
import { Story } from "interfaces";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import Image from "next/image";
import PrimaryButton from "components/button/primaryButton";
import { useTranslation } from "react-i18next";
import StoryLine from "./storyLine";
import useTimer from "hooks/useTimer";
import { STORY_DURATION } from "constants/story";
import { useSwiper } from "swiper/react";
import { useRouter } from "next/router";
import useRouterStatus from "hooks/useRouterStatus";
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
  const { isLoading } = useRouterStatus();

  useEffect(() => {
    if (!time) {
      storyNext(swiper);
    }
  }, [time]);

  const goToOrder = () => {
    push(`/shop/${data.shop_id}?product=${data.product_uuid}`, undefined, {
      shallow: true,
    });
  };

  return (
    <div className={cls.story}>
      <div className={cls.gradient} />
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
          <div className={cls.shop}>
            <ShopLogoBackground
              data={{
                logo_img: data.logo_img,
                translation: {
                  title: data.title,
                  locale: "en",
                  description: "",
                },
                id: data.shop_id,
                price: 0,
                open: true,
                verify: 0
              }}
              size="small"
            />
            <p className={cls.title}>{data.title}</p>
          </div>
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
      <div className={cls.footer}>
        <PrimaryButton onClick={goToOrder} loading={isLoading}>
          {t("go.to.order")}
        </PrimaryButton>
      </div>
    </div>
  );
}
