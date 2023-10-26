import React from "react";
import cls from "./orderList.module.scss";
import { Skeleton } from "@mui/material";
import { Parcel } from "interfaces/parcel.interface";
import ParcelOrderListItem from "components/parcelOrderListItem/parcleOrderListItem";

type Props = {
  data: Parcel[];
  loading?: boolean;
  active?: boolean;
};

export default function ParcelOrderList({
  data = [],
  loading = false,
  active = false,
}: Props) {
  return (
    <div className={cls.root}>
      {!loading
        ? data.map((item) => (
            <ParcelOrderListItem key={item.id} data={item} active={active} />
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
