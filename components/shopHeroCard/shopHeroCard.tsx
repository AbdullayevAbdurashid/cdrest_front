import React from "react";
import { IShop } from "interfaces";
import Link from "next/link";
import cls from "./shopHeroCard.module.scss";
import ShopLogo from "components/shopLogo/shopLogo";
import { useTranslation } from "react-i18next";
import getImage from "utils/getImage";
import FallbackImage from "components/fallbackImage/fallbackImage";
import VerifiedComponent from "components/verifiedComponent/verifiedComponent";

type Props = {
  data: IShop;
};

export default function ShopHeroCard({ data }: Props) {
  const { t } = useTranslation();

  return (
    <Link href={`/restaurant/${data.id}`} className={cls.wrapper}>
      <div className={cls.header}>
        <ShopLogo data={data} size="small" />
        <h4 className={cls.shopTitle}>
          {data.translation?.title}
          {<VerifiedComponent />}
        </h4>
      </div>
      <FallbackImage
        fill
        src={getImage(data.background_img)}
        alt={data.translation?.title}
        sizes="400px"
      />
      <div className={cls.badge}>
        <span className={cls.text}>
          {t("number.of.foods", { count: data.products_count || 0 })}
        </span>
      </div>
    </Link>
  );
}
