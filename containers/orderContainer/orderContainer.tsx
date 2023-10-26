import React from "react";
import { Grid, useMediaQuery } from "@mui/material";
import cls from "./orderContainer.module.scss";
import { Order } from "interfaces";
import OrderProducts from "components/orderProducts/orderProducts";
import OrderInfo from "components/orderInfo/orderInfo";

type Props = {
  data?: Order;
  loading: boolean;
};

export default function OrderContainer({ data, loading }: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <div className={cls.root}>
      {!loading && (
        <Grid container spacing={isDesktop ? 4 : 1.5}>
          <Grid item xs={12} md={7}>
            <OrderProducts data={data} />
          </Grid>
          <Grid item xs={12} md={5}>
            <OrderInfo data={data} />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
