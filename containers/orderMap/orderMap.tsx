import React from "react";
import Map from "components/map/map";
import { Order } from "interfaces";
import cls from "./orderMap.module.scss";
import { Skeleton } from "@mui/material";

type Props = {
  data?: Order;
  price?: number;
  loading?: boolean;
  fullHeight?: boolean;
  drawLine?: boolean;
  readonly?: boolean;
};

export default function OrderMap({
  data,
  loading = false,
  fullHeight,
  price,
  drawLine,
}: Props) {
  const location = {
    lat: Number(data?.location?.latitude) || 0,
    lng: Number(data?.location?.longitude) || 0,
  };

  return (
    <div className={`${cls.wrapper} ${fullHeight ? cls.fullHeight : ""}`}>
      {!loading ? (
        <Map
          location={location}
          defaultZoom={11}
          drawLine={drawLine}
          price={price}
          readOnly
          shop={data?.delivery_type === "pickup" ? undefined : data?.shop}
        />
      ) : (
        <Skeleton variant="rectangular" className={cls.shimmer} />
      )}
    </div>
  );
}
