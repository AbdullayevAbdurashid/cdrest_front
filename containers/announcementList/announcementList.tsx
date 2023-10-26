import { Grid } from "@mui/material";
import React from "react";
import cls from "./announcementList.module.scss";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";

type Props = {
  data: {
    title: string;
    button: string;
    img: string;
    color: string;
    icon: React.ReactElement;
  }[];
};

export default function AnnouncementList({ data }: Props) {
  const { t } = useTranslation();
  return (
    <div className="container">
      <div className={cls.list}>
        {data.map((item) => (
            <div key={item.title} className={`${cls.card} ${cls[item.color]}`}>
              <div className={cls.content}>
                <strong className={cls.title}>{t(item.title)}</strong>
                <Link href="/parcel-checkout" className={cls.button}>
                  <div className={`${cls.icon} ${cls[item.color]}`}>
                    {item.icon}
                  </div>
                  <span className={cls.text}>{t(item.button)}</span>
                </Link>
              </div>
              <Image
                className={cls.img}
                src={item.img}
                alt={item.title}
                width={150}
                height={140}
              />
            </div>
        ))}
      </div>
    </div>
  );
}
