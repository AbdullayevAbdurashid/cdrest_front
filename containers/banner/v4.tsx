import React from "react";
import cls from "./v4.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Banner } from "interfaces";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { useRouter } from "next/router";

type Props = {
  data?: Banner[];
  loading: boolean;
};

export default function BannerList({ data, loading }: Props) {
  const router = useRouter();
  if(data?.length ===0 && !loading) return null;
  return (
    <div className={cls.banners}>
      <Swiper
        centeredSlides
        spaceBetween={30}
        initialSlide={1}
        slidesPerView="auto"
        navigation={{
          prevEl: `.${cls.swiperBtnPrev}`,
          nextEl: `.${cls.swiperBtnNext}`,
        }}
        loop
        modules={[Navigation]}
      >
        {loading
          ? Array.from(Array(3).keys()).map((item) => (
              <SwiperSlide className={cls.swiperLoadingItem} key={item}>
                <Skeleton className={cls.shimmer} variant="rectangular" />
              </SwiperSlide>
            ))
          : data?.map((banner) => (
              <SwiperSlide className={cls.swiperItem} key={banner.id}>
                <div className="shadowLeft" />
                <button
                  onClick={() =>
                    banner.clickable === 1
                      ? router.push(`/promotion/${banner.id}`)
                      : {}
                  }
                  className={cls.bannerImg}
                >
                  <Image
                    src={banner.img}
                    priority
                    alt={banner.translation?.title || "banner_img"}
                    title={banner.translation?.title}
                    fill
                    sizes="(max-width: 992px) 70vw, (max-width: 768px) 50vw, (max-width: 450px) 30vw"
                  />
                </button>
                <div className="shadowRight" />
              </SwiperSlide>
            ))}
        <button className={cls.swiperBtnPrev}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_203_2393)">
              <path
                d="M10.8283 12L15.7783 16.95L14.3643 18.364L8.00032 12L14.3643 5.63601L15.7783 7.05001L10.8283 12Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_203_2393">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="matrix(-1 0 0 -1 24 24)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
        <button className={cls.swiperBtnNext}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_203_2388)">
              <path
                d="M13.1717 12L8.22168 7.04999L9.63568 5.63599L15.9997 12L9.63568 18.364L8.22168 16.95L13.1717 12Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_203_2388">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </Swiper>
    </div>
  );
}
