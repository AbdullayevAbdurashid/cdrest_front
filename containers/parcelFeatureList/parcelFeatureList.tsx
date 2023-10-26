import { IParcelFeature, Story } from "interfaces";
import React from "react";
import cls from "./parcelFeatureList.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import FeatureComponent from "components/parcelFeaturesingle/parcelFeatureSingle";
import { useTranslation } from "react-i18next";

type Props = {
  data?: IParcelFeature[][];
  loading: boolean;
};

const storySettings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "full-width",
  breakpoints: {
    1140: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 3.5
    },
    576: {
      slidesPerView: 2.5,
      spaceBetween: 10
    },
    0: {
      slidesPerView: 2.1
    }
  },
};

export default function ParcelFeatureList({ data, loading }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <h6 className={cls.title}>{t("how.it.works")}</h6>
      <div className={cls.storyContainer}>
        <Swiper {...storySettings} slidesPerView="auto">
          {data?.map((item, idx) => (
            <SwiperSlide key={idx}>
              <FeatureComponent data={item} list={data} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
