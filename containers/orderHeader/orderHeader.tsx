import React from "react";
import { Order } from "interfaces";
import cls from "./orderHeader.module.scss";
import { useTranslation } from "react-i18next";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import StepperComponent from "components/stepperComponent/stepperComponent";
import dayjs from "dayjs";
import { Skeleton } from "@mui/material";
import BonusCaption from "components/bonusCaption/bonusCaption";

type Props = {
  data?: Order;
  loading?: boolean;
};

export default function OrderHeader({ data, loading = false }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cls.root}>
      <div className="container">
        <div className={cls.wrapper}>
          <div className={cls.shopInfo}>
            <ShopLogoBackground data={data?.shop} loading={loading} />
            {!loading ? (
              <div className={cls.naming}>
                <h1 className={cls.title}>{data?.shop.translation?.title}</h1>
                <p className={cls.text}>
                  {data?.shop.bonus ? (
                    <BonusCaption data={data?.shop?.bonus} />
                  ) : (
                    data?.shop.translation?.description
                  )}
                </p>
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
                <StepperComponent status={data?.status || ""} />
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
