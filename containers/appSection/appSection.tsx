/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./appSection.module.scss";
import { IPage } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data?: IPage[];
};

export default function AppSection({ data = [] }: Props) {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id} className={cls.container}>
          <div className="container">
            <div className={cls.wrapper}>
              <div className={cls.imgWrapper}>
                <FallbackImage
                  fill
                  src={item.img}
                  alt={item.translation?.title}
                  sizes="(max-width: 768px) 600px, 1072px"
                />
              </div>
              <div className={cls.content}>
                <h1 className={cls.title}>{item.translation?.title}</h1>
                <p
                  className={cls.text}
                  dangerouslySetInnerHTML={{
                    __html: item.translation?.description || "",
                  }}
                />
                <div className={cls.flex}>
                  <a
                    href={item.buttons?.app_store_button_link}
                    className={cls.item}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/images/app-store.webp" alt="App store" />
                  </a>
                  <a
                    href={item.buttons?.google_play_button_link}
                    className={cls.item}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/images/google-play.webp" alt="Google play" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
