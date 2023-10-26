import React from "react";
import cls from "./v3.module.scss";
import { IShop } from "interfaces";
import useLocale from "hooks/useLocale";

type Props = {
  data: IShop;
};

export default function ShopBadges({ data }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.badge}>
      {data.price === 0 && (
        <div className={`${cls.item} ${cls.blue}`}>{t("delivery.free")}</div>
      )}
      {!!data.discount?.length && (
        <div className={`${cls.item} ${cls.red}`}>{t("discount")}</div>
      )}
      {!!data.bonus && (
        <div className={`${cls.item} ${cls.green}`}>{t("bonus")}</div>
      )}
    </div>
  );
}
