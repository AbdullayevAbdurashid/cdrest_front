/* eslint-disable react/no-unescaped-entities */
import React from "react";
import cls from "./content.module.scss";
import SupportCard from "components/supportCard/supportCard";
import { ICareer } from "interfaces/career.interface";

type Props = {
  data?: ICareer;
};

export default function CareersContent({ data }: Props) {
  return (
    <div className={`container ${cls.container}`}>
      <div className={cls.header}>
        <h1 className={cls.title}>{data?.translation?.title}</h1>
        <p className={cls.text}>
          {data?.category?.translation?.title}, {data?.translation?.address}
        </p>
      </div>
      <main className={cls.content}>
        <div
          dangerouslySetInnerHTML={{
            __html: data?.translation?.description || "",
          }}
        />
      </main>
      <SupportCard />
    </div>
  );
}
