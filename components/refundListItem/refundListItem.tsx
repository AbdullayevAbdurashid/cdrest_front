import React from "react";
import { Refund } from "interfaces";
import cls from "./refundListItem.module.scss";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import CloseCircleLineIcon from "remixicon-react/CloseCircleLineIcon";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";
import { useTranslation } from "react-i18next";

type Props = {
  data: Refund;
  active: boolean;
};

export default function RefundListItem({ data, active }: Props) {
  const { t } = useTranslation();

  return (
    <Link href={`/orders/${data.order.id}`} className={cls.wrapper}>
      <div className={cls.flex}>
        <div className={`${cls.badge} ${active ? cls.active : ""}`}>
          {active ? (
            <Loader4LineIcon />
          ) : data.status === "approved" ? (
            <CheckDoubleLineIcon />
          ) : (
            <CloseCircleLineIcon />
          )}
        </div>
        <div className={cls.naming}>
          <h3 className={cls.title}>#{data.id}</h3>
          <p className={cls.text}>{t("order.id")}</p>
        </div>
        <div className={cls.naming}>
          <h3 className={cls.title}>{data.order.shop.translation?.title}</h3>
          <p className={cls.text}>{data.cause}</p>
        </div>
      </div>
      <div className={cls.actions}>
        <div className={cls.orderInfo}>
          <h5 className={cls.price}>{t(data.status)}</h5>
          <p className={cls.text}>{data.answer}</p>
        </div>
        <div className={cls.arrowBtn}>
          <ArrowRightSLineIcon />
        </div>
      </div>
    </Link>
  );
}
