import React from "react";
import cls from "./orderList.module.scss";
import { Skeleton } from "@mui/material";
import Empty from "components/empty/empty";
import useLocale from "hooks/useLocale";
import { IBooking } from "interfaces/booking.interface";
import ReservationHistoryItem from "components/reservationHistoryItem/reservationHistoryItem";

type Props = {
  data: IBooking[];
  loading?: boolean;
};

export default function ReservationHistory({
  data = [],
  loading = false,
}: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.root}>
      {!loading
        ? data.map((item, idx) => (
            <ReservationHistoryItem
              key={item.id}
              data={item}
              dataIdx={idx + 1}
            />
          ))
        : Array.from(new Array(3)).map((item, idx) => (
            <Skeleton
              key={"booking" + idx}
              variant="rectangular"
              className={cls.shimmer}
            />
          ))}
      {!loading && !data.length && <Empty text={t("no.reservations.found")} />}
    </div>
  );
}
