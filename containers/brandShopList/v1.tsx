import { Skeleton } from "@mui/material";
import BrandShopCard from "components/brandShopCard/v1";
import { IShop } from "interfaces";
import React from "react";
import cls from "./v1.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTheme } from "contexts/theme/theme.context";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";

type Props = {
  data?: IShop[];
  loading: boolean;
};

export default function BrandShopList({ data, loading }: Props) {
  const { t } = useTranslation();
  const { direction } = useTheme();
  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.header}>
          <h2 className={cls.title}>{t("favorite.brands")}</h2>
          <Link href="/shop?verify=1" className={cls.link}>
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
            ? Array.from(Array(10).keys()).map((item) => (
                <Skeleton
                  className={cls.shimmer}
                  key={item}
                  variant="rectangular"
                />
              ))
            : data?.map((shop) => <BrandShopCard key={shop.id} data={shop} />)}
        </div>
      </div>
    </div>
  );
}
