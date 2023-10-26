/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./beDelivery.module.scss";
import { useSettings } from "contexts/settings/settings.context";
import { IPage } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data?: IPage;
};

export default function BeDelivery({ data }: Props) {
  const { settings } = useSettings();

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.wrapper}>
          <div className={cls.content}>
            <h1 className={cls.title}>{data?.translation?.title}</h1>
            <div
              className={cls.text}
              dangerouslySetInnerHTML={{
                __html: data?.translation?.description || "",
              }}
            />
            <div className={cls.flex}>
              <a
                href={settings?.delivery_app_ios}
                className={cls.item}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/app-store.webp" alt="App store" />
              </a>
              <a
                href={settings?.delivery_app_android}
                className={cls.item}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/google-play.webp" alt="Google play" />
              </a>
            </div>
          </div>
          <div className={cls.imgWrapper}>
            <FallbackImage
              fill
              src={data?.img}
              alt={data?.translation?.title}
              sizes="(max-width: 768px) 600px, 1072px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
