import React from "react";
import { IShop } from "interfaces";
import cls from "./storeCard.module.scss";
import Link from "next/link";
import getImage from "utils/getImage";
import BonusCaption from "components/bonusCaption/bonusCaption";
import TaxiFillIcon from "remixicon-react/TaxiFillIcon";
import FallbackImage from "components/fallbackImage/fallbackImage";
import getShortTimeType from "utils/getShortTimeType";
import useLocale from "hooks/useLocale";
import VerifiedComponent from "components/verifiedComponent/verifiedComponent";

type Props = {
  data: IShop;
};

export default function StoreCard({ data }: Props) {
  const { t } = useLocale();

  return (
    <Link href={`/shop/${data.id}`} className={cls.wrapper}>
      <div className={cls.header}>
        <FallbackImage
          fill
          src={getImage(data.background_img)}
          alt={data.translation?.title}
          sizes="286px"
        />
        <div className={cls.badge}>
          <TaxiFillIcon />
          <span className={cls.text}>
            {data.delivery_time?.from}-{data.delivery_time?.to}{" "}
            {t(getShortTimeType(data.delivery_time?.type))}
          </span>
        </div>
      </div>
      <div className={cls.body}>
        <h3 className={cls.title}>
          {data.translation?.title}
          {data?.verify === 1 && <VerifiedComponent />}
        </h3>
        <p className={cls.text}>
          {data.bonus ? (
            <BonusCaption data={data.bonus} />
          ) : (
            data.translation?.description
          )}
        </p>
      </div>
    </Link>
  );
}
