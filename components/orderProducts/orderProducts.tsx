import React from "react";
import { Order } from "interfaces";
import cls from "./orderProducts.module.scss";
import { useTranslation } from "react-i18next";
import OrderProductItem from "components/orderProductItem/orderProductItem";

type Props = {
  data?: Order;
};

export default function OrderProducts({ data }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <h3 className={cls.title}>{t("order.details")}</h3>
      </div>
      <div className={cls.body}>
        {data?.details.map((item) => (
          <OrderProductItem key={item.id} data={item} order={data} />
        ))}
      </div>
    </div>
  );
}
