import React from "react";
import { IShop } from "interfaces";
import cls from "./v2.module.scss";
import Link from "next/link";
import getImage from "utils/getImage";
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
          src={getImage(data.logo_img)}
          alt={data.translation?.title}
          sizes="140px"
        />
      </div>
      <div className={cls.body}>
        <h3 className={cls.titleVerify}>
          <div className={cls.title}>{data.translation?.title}asd</div>
          {data?.verify === 1 && <VerifiedComponent />}
        </h3>
        <p className={cls.text}>
          {data.delivery_time?.from}-{data.delivery_time?.to}{" "}
          {t(getShortTimeType(data.delivery_time?.type))}
        </p>
      </div>
    </Link>
  );
}
