import React from "react";
import { Grid, useMediaQuery } from "@mui/material";
import cls from "./orderContainer.module.scss";
import { Parcel } from "interfaces/parcel.interface";
import ParcelInfo from "components/orderInfo/parcelInfo";
import ParcelDetails from "components/orderProducts/parcelDetails";

type Props = {
  data?: Parcel;
  loading: boolean;
};

export default function ParcelContainer({ data, loading }: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <div className={cls.root}>
      {!loading && (
        <Grid container spacing={isDesktop ? 4 : 1.5}>
          <Grid item xs={12} md={7}>
            <ParcelDetails data={data} />
          </Grid>
          <Grid item xs={12} md={5}>
            <ParcelInfo data={data} />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
