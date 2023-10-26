import React from "react";
import cls from "./orderHeader.module.scss";
import useLocale from "hooks/useLocale";
import dayjs from "dayjs";
import { Skeleton } from "@mui/material";
import { Parcel } from "interfaces/parcel.interface";
import ParcelStepperComponent from "components/stepperComponent/parcelStepper";

type Props = {
  data?: Parcel;
  loading?: boolean;
};

export default function ParcelHeader({ data, loading = false }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.root}>
      <div className="container">
        <div className={cls.wrapper}>
          <div className={cls.shopInfo}>
            {!loading ? (
              <div className={cls.naming}>
                <h1 className={cls.title}>{data?.username_from}</h1>
                <p className={cls.text}>{data?.address_from?.address}</p>
              </div>
            ) : (
              <div className={cls.naming}>
                <Skeleton variant="text" className={cls.shimmerTitle} />
                <Skeleton variant="text" className={cls.shimmerDesc} />
              </div>
            )}
          </div>
          <div className={cls.statusWrapper}>
            {!loading ? (
              <>
                <div className={cls.status}>
                  <label>{t(data?.status)}</label>
                  <div className={cls.time}>
                    <span className={cls.text}>
                      {dayjs(data?.updated_at).format("HH:mm")}
                    </span>
                  </div>
                </div>
                <ParcelStepperComponent status={data?.status || ""} />
              </>
            ) : (
              <Skeleton variant="rectangular" className={cls.shimmer} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
