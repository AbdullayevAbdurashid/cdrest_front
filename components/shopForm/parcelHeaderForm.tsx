import React from "react";
import cls from "./shopForm.module.scss";
import { FormikProps } from "formik";
import { Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { ParcelFormValues, ParcelType } from "interfaces/parcel.interface";
import { useSelector } from "react-redux";
import { selectCurrency } from "redux/slices/currency";
import parcelService from "services/parcel";
import Price from "components/price/price";
import { Order } from "interfaces";
import OrderMap from "containers/orderMap/orderMap";

type Props = {
  children?: any;
  lang?: string;
  formik: FormikProps<ParcelFormValues>;
  loading?: boolean;
  xs?: number;
  md?: number;
  lg?: number;
  handleSelectType: (value: ParcelType) => void;
};

export default function ParcelHeaderForm({
  children,
  formik,
  lang,
  xs,
  md,
  lg,
  loading,
  handleSelectType,
}: Props) {
  const { t } = useTranslation();
  const currency = useSelector(selectCurrency);
  const isDesktop = useMediaQuery("(min-width:900px)");

  const { location_from, location_to, type_id } = formik.values;

  const { data: price } = useQuery(
    ["calculateParcel", location_from, location_to, type_id, currency],
    () =>
      parcelService.calculate({
        address_from: location_from,
        address_to: location_to,
        type_id,
        currency_id: currency?.id,
      }),
    {
      enabled: Boolean(type_id),
      select: (data) => data.data.price,
    }
  );

  return (
    <Grid item xs={xs} md={md} lg={lg}>
      <div className={cls.container}>
        { isDesktop && (
          <div className={cls.map}>
            <OrderMap
              fullHeight
              drawLine
              data={
                {
                  location: location_from,
                  shop: {
                    id: 0,
                    logo_img: "/images/finish.png",
                    location: location_to,
                    translation: {
                      title: "Finish",
                      locale: "en",
                      description: "",
                    },
                    price: 0,
                    open: true,
                  },
                } as Order
              }
              price={price}
            />
          </div>
        )}
        <div className={cls.heading}>
          <strong className={cls.title}>{t("door.to.door.delivery")}</strong>
          <span className={cls.desc}>
            {t("door.to.door.delivery.description")}
          </span>
        </div>
        <div className={cls.wrapper}>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, {
              formik,
              lang,
              loading,
              handleSelectType,
            });
          })}
        </div>
        {price && (
          <span className={cls.price}>
            {t("pay")} <Price number={price} />
          </span>
        )}
      </div>
    </Grid>
  );
}
