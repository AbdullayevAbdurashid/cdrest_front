/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./v4.module.scss";
import { Skeleton } from "@mui/material";
import { Banner } from "interfaces";
import Link from "next/link";

type Props = {
  data?: Banner[];
  loading: boolean;
};

export default function AdList({ data, loading }: Props) {
  if (!loading && data?.length === 0) return null;
  return (
    <div className="container">
      <div className={cls.grid}>
        {loading
          ? Array.from(Array(6).keys()).map((item) => (
              <Skeleton
                variant="rectangular"
                className={cls.gridItem}
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
  );
}
