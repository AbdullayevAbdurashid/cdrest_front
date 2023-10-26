import React from "react";
import cls from "./reservationHistoryItem.module.scss";
import dayjs from "dayjs";
import { Grid } from "@mui/material";
import useLocale from "hooks/useLocale";
import { IBooking } from "interfaces/booking.interface";

type Props = {
  data: IBooking;
  dataIdx: number;
};

export default function ReservationHistoryItem({ data, dataIdx }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.wrapper}>
      <Grid container spacing={4} alignItems="center">
        <Grid item sm={4} md={3} lg={2}>
          <div className={cls.item}>
            <div className={cls.badge}>{dataIdx}</div>
            <div className={cls.naming}>
              <h3 className={cls.title}>#{data.id}</h3>
              <p className={cls.text}>{t("reservation.id")}</p>
            </div>
          </div>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          <h3 className={cls.title}>{data.table?.name}</h3>
          <p className={cls.text}>{t("table")}</p>
        </Grid>
        <Grid item sm={4} md={3} lg={3}>
          <h3 className={cls.title}>
            {dayjs(data.start_date).format("DD.MM.YY — HH:mm")}
          </h3>
          <p className={cls.text}>{t("date")}</p>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          <h3 className={cls.title}>{t(data.status)}</h3>
          <p className={cls.text}>{t("status")}</p>
        </Grid>
      </Grid>
    </div>
  );
}
