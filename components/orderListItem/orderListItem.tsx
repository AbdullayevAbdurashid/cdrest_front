import React from "react";
import { Order } from "interfaces";
import cls from "./orderListItem.module.scss";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import CloseCircleLineIcon from "remixicon-react/CloseCircleLineIcon";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";
import Price from "components/price/price";
import dayjs from "dayjs";

type Props = {
  data: Order;
  active: boolean;
};

export default function OrderListItem({ data, active }: Props) {
  return (
    <Link href={`/orders/${data.id}`} className={cls.wrapper}>
      <div className={cls.flex}>
        <div className={`${cls.badge} ${active ? cls.active : ""}`}>
          {active ? (
            <Loader4LineIcon />
          ) : data.status === "delivered" ? (
            <CheckDoubleLineIcon />
          ) : (
            <CloseCircleLineIcon />
          )}
        </div>
        <ShopLogoBackground data={data.shop} size="small" />
        <div className={cls.naming}>
          <h3 className={cls.title}>{data.shop.translation?.title}</h3>
          <p className={cls.text}>{data.shop.translation?.description}</p>
        </div>
      </div>
      <div className={cls.actions}>
        <div className={cls.orderInfo}>
          <h5 className={cls.price}>
            <Price number={data.total_price < 0 ? 0 : data.total_price} symbol={data.currency?.symbol} />
          </h5>
          <p className={cls.text}>
            {dayjs(data.created_at).format("DD.MM.YY — HH:mm")}
          </p>
        </div>
        <div className={cls.arrowBtn}>
          <ArrowRightSLineIcon />
        </div>
      </div>
    </Link>
  );
}
