/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./aboutUs.module.scss";
import { IPage } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data?: IPage;
};

export default function AboutUs({ data }: Props) {
  return (
    <div className={cls.container}>
      <div className="container">
      <div className={cls.header}>
        <h1 className={cls.title}>{data?.translation?.title}</h1>
        <p className={cls.text}></p>
      </div>
      <div className={cls.hero}>
        <FallbackImage
          fill
          src={data?.img}
          alt={data?.translation?.title}
          sizes="(max-width: 768px) 600px, 1072px"
        />
      </div>
      <main className={cls.content}>
        <div
          className={cls.text}
          dangerouslySetInnerHTML={{
            __html: data?.translation?.description || "",
          }}
        />
      </main>
    </div>
    </div>
  );
}
