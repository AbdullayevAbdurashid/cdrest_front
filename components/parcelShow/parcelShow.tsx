import React from "react";
import cls from "./parcelShow.module.scss";
import FallbackImage from "components/fallbackImage/fallbackImage";
import getImage from "utils/getImage";
import useLocale from "hooks/useLocale";
import { ParcelType } from "interfaces/parcel.interface";

type Props = {
  data?: ParcelType;
};

export default function ParcelShow({ data }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.wrapper}>
      <h1 className={cls.title}>{data?.type}</h1>
      <div className={cls.flex}>
        <aside className={cls.aside}>
          <div className={cls.imageWrapper}>
            <FallbackImage
              fill
              src={getImage(data?.img)}
              alt={data?.type}
              sizes="320px"
              quality={90}
            />
          </div>
        </aside>
        <main className={cls.main}>
          <div className={cls.body}>
            <div className={cls.rowItem}>
              <strong>{t("weight")}: </strong>
              {t("up.to.weight", { number: Number(data?.max_g) / 1000 })}
            </div>
            <div className={cls.rowItem}>
              <strong>{t("length")}: </strong>
              {t("up.to.length", { number: Number(data?.max_length) / 100 })}
            </div>
            <div className={cls.rowItem}>
              <strong>{t("height")}: </strong>
              {t("up.to.length", { number: Number(data?.max_height) / 100 })}
            </div>
            <div className={cls.rowItem}>
              <strong>{t("width")}: </strong>
              {t("up.to.length", { number: Number(data?.max_width) / 100 })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
