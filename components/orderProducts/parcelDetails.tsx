import React from "react";
import cls from "./orderProducts.module.scss";
import useLocale from "hooks/useLocale";
import { Parcel } from "interfaces/parcel.interface";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data?: Parcel;
};

export default function ParcelDetails({ data }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <h3 className={cls.title}>{t("parcel.details")}</h3>
      </div>
      <div className={cls.body}>
        {!!data?.img && (
          <div className={cls.flex}>
            {/* {data?.images?.map((img) => (
            <div key={img} className={cls.item}>
              <FallbackImage src={img} alt={img} />
            </div>
          ))} */}
            <div className={cls.item}>
              <FallbackImage src={data?.img} alt={data?.img} />
            </div>
          </div>
        )}
        <br />
        <label>{t("type")}</label>
        <h6 className={cls.text}>{data?.type?.type}</h6>
        <br />
        <label>{t("receiver")}</label>
        <h6 className={cls.text}>{data?.username_to}</h6>
        <br />
        <label>{t("phone.number")}</label>
        <h6 className={cls.text}>{data?.phone_to}</h6>
        <br />
        <label>{t("note")}</label>
        <h6 className={cls.text} style={{ textTransform: "capitalize" }}>
          {data?.note}
        </h6>
      </div>
    </div>
  );
}
