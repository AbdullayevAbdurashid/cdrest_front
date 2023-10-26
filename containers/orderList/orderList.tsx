import React from "react";
import cls from "./orderList.module.scss";
import { Order } from "interfaces";
import { Skeleton } from "@mui/material";
import OrderListItem from "components/orderListItem/orderListItem";

type Props = {
  data: Order[];
  loading?: boolean;
  active?: boolean;
};

export default function OrderList({
  data = [],
  loading = false,
  active = false,
}: Props) {
  return (
    <div className={cls.root}>
      {!loading
        ? data.map((item) => (
            <OrderListItem key={item.id} data={item} active={active} />
          ))
        : Array.from(new Array(3)).map((item, idx) => (
            <Skeleton
              key={"shops" + idx}
              variant="rectangular"
              className={cls.shimmer}
            />
          ))}
    </div>
  );
}
