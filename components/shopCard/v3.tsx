import React from "react";
import { IShop } from "interfaces";
import cls from "./v3.module.scss";
import Link from "next/link";
import getImage from "utils/getImage";
import ShopBadges from "containers/shopBadges/v3";
import FallbackImage from "components/fallbackImage/fallbackImage";
import useLocale from "hooks/useLocale";
import StarFillIcon from "remixicon-react/StarFillIcon";
import ShopCardDeliveryInfo from "components/shopCardDeliveryInfo/shopCardDeliveryInfo";
import VerifiedComponent from "components/verifiedComponent/verifiedComponent";

type Props = {
  data: IShop;
};

export default function ShopCard({ data }: Props) {
  const { t } = useLocale();

  return (
    <Link
      href={`/shop/${data.id}`}
      className={`${cls.wrapper} ${data.open ? "" : cls.closed}`}
    >
      <div className={cls.header}>
        {!data.open && <div className={cls.closedText}>{t("closed")}</div>}
        <FallbackImage
          fill
          src={getImage(data.background_img)}
          alt={data.translation?.title}
          sizes="400px"
        />
        <ShopBadges data={data} />
        <ShopCardDeliveryInfo data={data.delivery_time} />
      </div>
      <div className={cls.body}>
        <h3 className={cls.title}>
          {data.translation?.title}
          {data?.verify === 1 && <VerifiedComponent />}
        </h3>
        <div className={cls.bottom}>
          <div className={cls.desc}>{data.translation?.description}</div>
          <div className={cls.flex}>
            <StarFillIcon />
            <span className={cls.text}>
              {data?.rating_avg?.toFixed(1) || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
