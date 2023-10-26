import React from "react";
import cls from "./bannerHeader.module.scss";
import { Banner } from "interfaces";

type Props = {
  data: Banner;
};

export default function BannerHeader({ data }: Props) {
  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.header}>
          <h1 className={cls.title}>{data.translation?.title}</h1>
          <p className={cls.text}>{data.translation?.description}</p>
        </div>
      </div>
    </div>
  );
}
