import React from "react";
import cls from "./category.module.scss";
import useLocale from "hooks/useLocale";
import Link from "next/link";
import { Category } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { Skeleton } from "@mui/material";

type Props = {
  categories?: Category[];
  loading?: boolean;
  hasNextPage?: boolean;
};

export default function CategoryContainer({
  categories = [],
  loading,
  hasNextPage,
}: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.wrapper}>
          <div className={cls.title}>{t("hero.title")}</div>
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
          {hasNextPage && (
            <Link href="/shop-category" className={cls.moreBtn}>
              {t("see.all")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
