import React from "react";
import { ShopDeliveryTime } from "interfaces";
import cls from "./shopCardDeliveryInfo.module.scss";
import { DeliveryIcon } from "components/icons";
import useLocale from "hooks/useLocale";
import getShortTimeType from "utils/getShortTimeType";

type Props = {
  data?: ShopDeliveryTime;
};

export default function ShopCardDeliveryInfo({ data }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.wrapper}>
      <div className={cls.flex}>
        <DeliveryIcon />
        <span className={cls.text}>
          {data?.from}-{data?.to} {t(getShortTimeType(data?.type))}
        </span>
      </div>
    </div>
  );
}
