/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./v1.module.scss";
import { Skeleton } from "@mui/material";
import { Banner } from "interfaces";
import Link from "next/link";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import { useTranslation } from "react-i18next";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import { useTheme } from "contexts/theme/theme.context";

type Props = {
  data?: Banner[];
  loading: boolean;
};

export default function AdList({ data, loading }: Props) {
  const { t } = useTranslation();
  const { direction } = useTheme();
  return (
    <div className={cls.container} style={{display: data?.length === 0 && !loading ? 'none' : 'block'}}>
      <div className="container">
        <div className={cls.header}>
          <h2 className={cls.title}>{t("new.items.with.discount")}</h2>
          <Link href="/ads" className={cls.link}>
            <span className={cls.text}>{t("see.all")}</span>
            {direction === "rtl" ? (
              <ArrowLeftSLineIcon />
            ) : (
              <ArrowRightSLineIcon />
            )}
          </Link>
        </div>

        <div className={cls.grid}>
          {loading
            ? Array.from(Array(3).keys()).map((item) => (
                <Skeleton
                  variant="rectangular"
                  className={cls.gridItem}
                  height={300}
                  key={item}
                />
              ))
            : data?.map((item) => (
                <Link
                  className={`${cls.gridItem}`}
                  key={item.id}
                  href={`/ads/${item.id}`}
                >
                  <div>
                    <img src={item.img} alt="banner" />
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
