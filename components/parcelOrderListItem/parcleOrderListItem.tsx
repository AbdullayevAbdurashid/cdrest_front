import React from "react";
import cls from "./parcleOrderListItem.module.scss";
import { Parcel } from "interfaces/parcel.interface";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import CloseCircleLineIcon from "remixicon-react/CloseCircleLineIcon";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";
import dayjs from "dayjs";
import { Grid } from "@mui/material";
import useLocale from "hooks/useLocale";

type Props = {
  data: Parcel;
  active: boolean;
};

export default function ParcelOrderListItem({ data, active }: Props) {
  const { t } = useLocale();

  return (
    <Link href={`/parcels/${data.id}`} className={cls.wrapper}>
      <Grid container spacing={4} alignItems="center">
        <Grid item sm={4} md={3} lg={3}>
          <div className={cls.item}>
            <div className={`${cls.badge} ${active ? cls.active : ""}`}>
              {active ? (
                <Loader4LineIcon />
              ) : data.status === "delivered" ? (
                <CheckDoubleLineIcon />
              ) : (
                <CloseCircleLineIcon />
              )}
            </div>
            <div className={cls.naming}>
              <h3 className={cls.title}>{data.username_to}</h3>
              <p className={cls.text}>{t("receiver")}</p>
            </div>
          </div>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          <h3 className={cls.title}>{data.phone_to}</h3>
          <p className={cls.text}>{t("phone")}</p>
        </Grid>
        <Grid item sm={4} md={3} lg={4}>
          <h3 className={cls.title}>{data.address_to?.address}</h3>
          <p className={cls.text}>{t("address")}</p>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          <h3 className={cls.title}>
            {dayjs(data.updated_at).format("DD.MM.YY — HH:mm")}
          </h3>
          <p className={cls.text}>{t("date")}</p>
        </Grid>
        <Grid item sm={4} md={3} lg={1}>
          <div className={cls.arrowBtn}>
            <ArrowRightSLineIcon />
          </div>
        </Grid>
      </Grid>
    </Link>
  );
}
