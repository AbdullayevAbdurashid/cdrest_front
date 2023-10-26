import React from "react";
import cls from "./brand.module.scss";
import { Skeleton } from "@mui/material";
import StoreCard from "components/storeCard/v3";
import { IShop } from "interfaces";

type Props = {
  data: IShop[];
  loading: boolean;
  title: string;
};

export default function BrandPage({ data, loading, title }: Props) {
  return (
    <div className={cls.container}>
      <section className="container">
        <div className={cls.wrapper}>
          <div className={cls.header}>
            <h2 className={cls.title}>{title}</h2>
          </div>
          <div className={cls.grid}>
            {!loading
              ? data.map((item) => (
                  <StoreCard key={"brand-" + item.id} data={item} />
                ))
              : Array.from(new Array(8)).map((_, idx) => (
                  <Skeleton
                    key={"store" + idx}
                    variant="rectangular"
                    className={cls.shimmer}
                  />
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
