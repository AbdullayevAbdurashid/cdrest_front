import React from "react";
import cls from "./categoryList.module.scss";
import Link from "next/link";
import { Category } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { Skeleton } from "@mui/material";

type Props = {
  categories?: Category[];
  loading?: boolean;
};

export default function CategoryList({ categories = [], loading }: Props) {
  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.wrapper}>
          {!loading
            ? categories.map((item) => (
                <div key={item.uuid} className={cls.item}>
                  <Link
                    href={`/shop-category/${item.uuid}`}
                    className={cls.card}
                  >
                    <span className={cls.text}>{item.translation?.title}</span>
                    <div className={cls.imgWrapper}>
                      <FallbackImage
                        src={item.img}
                        alt={item.translation?.title}
                      />
                    </div>
                  </Link>
                </div>
              ))
            : Array.from(new Array(10)).map((item, idx) => (
                <Skeleton
                  key={"shopCategory" + idx}
                  variant="rectangular"
                  className={cls.shimmer}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
