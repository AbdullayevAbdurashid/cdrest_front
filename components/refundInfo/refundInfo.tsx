import React from "react";
import { Refund } from "interfaces";
import cls from "./refundInfo.module.scss";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

type Props = {
  list: Refund[];
};

export default function RefundInfo({ list }: Props) {
  const { t } = useTranslation();
  const data = list[list.length - 1];

  if (list.length) {
    return (
      <div className={cls.wrapper}>
        <div className={cls.header}>
          <h4 className={cls.title}>{t("refund")}</h4>
          <div className={cls.subtitle}>
            <span className={cls.text}>#{data.id}</span>
            <span className={cls.dot} />
            <span className={cls.text}>
              {dayjs(data.updated_at).format("MMM DD, HH:mm")}
            </span>
          </div>
          <div className={`${cls.badge} ${cls[data.status ?? "pending"]}`}>
            <span className={cls.text}>{t(data.status)}</span>
          </div>
        </div>
        <div className={cls.comment}>
          <label>{t("your.comment")}</label>
          <h6 className={cls.text}>{data.cause}</h6>
        </div>
        <div className={cls.comment}>
          <label>{t("answer")}</label>
          <h6 className={cls.text}>{data.answer}</h6>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
