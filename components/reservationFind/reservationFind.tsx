import React, { useState, useRef } from "react";
import cls from "./reservationFind.module.scss";
import { Grid } from "@mui/material";
import { useFormik } from "formik";
import PrimaryButton from "components/button/primaryButton";
import useLocale from "hooks/useLocale";
import RcDatePicker from "components/pickers/rcDatePicker";
import SecondaryButton from "components/button/secondaryButton";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import bookingService from "services/booking";
import { useRestaurant } from "contexts/restaurant/restaurant.context";
import getFirstReservationDate from "utils/getFirstReservationDate";
import RcShopSelect from "components/pickers/rcShopSelect";
import { IShop } from "interfaces";

type Props = {
  handleClose: () => void;
};
interface formValues {
  shop_id?: number;
  date?: string;
  zone_id?: string;
  number_of_people?: number;
}

export default function ReservationFind({ handleClose }: Props) {
  const { t, locale } = useLocale();
  const { push } = useRouter();
  const { restaurant } = useRestaurant();
  const searchAndSelectRef = useRef(null);
  const [selectedShop, setSelectedShop] = useState<IShop | undefined>();

  const { data: zones } = useQuery(
    ["zones", locale, selectedShop?.id],
    () =>
      bookingService.getZones({
        page: 1,
        perPage: 100,
        shop_id: selectedShop?.id,
      }),
    {
      select: (data) =>
        data.data.map((item) => ({
          label: item.translation?.title || "",
          value: String(item.id),
          data: item,
        })),
      enabled: !!selectedShop,
    }
  );

  const formik = useFormik({
    initialValues: {
      shop_id: selectedShop?.id,
      zone_id: zones ? zones[0]?.value : undefined,
      date: restaurant ? getFirstReservationDate(restaurant).date : undefined,
      number_of_people: 2,
    },
    enableReinitialize: true,
    onSubmit: (values: formValues, { setSubmitting }) => {
      push({
        pathname: `/reservations/${values.shop_id}`,
        query: {
          zone_id: values.zone_id,
          date_from: values.date,
          guests: 2,
        },
      }).finally(() => setSubmitting(true));
    },
    validate: (values: formValues) => {
      const errors: formValues = {};
      if (!values.date) {
        errors.date = t("required");
      }
      if (!values.shop_id) {
        errors.shop_id = t("required");
      }

      return errors;
    },
  });

  return (
    <div className={cls.wrapper}>
      <h1 className={cls.title}>{t("make.reservation")}</h1>
      <form className={cls.form} onSubmit={formik.handleSubmit}>
        <Grid container spacing={4} ref={searchAndSelectRef}>
          <Grid item xs={12} md={6}>
            <RcShopSelect
              hasSection={1}
              label={t("restaurant")}
              value={selectedShop}
              onChange={(value) => {
                setSelectedShop(value);
                formik.setFieldValue("shop_id", value?.id);
              }}
              error={!!formik.errors.shop_id && formik.touched.shop_id}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RcDatePicker
              name="date"
              label={t("date")}
              value={formik.values.date}
              error={!!formik.errors.zone_id && formik.touched.zone_id}
              onChange={(event) => {
                formik.setFieldValue("date", event);
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <SecondaryButton type="button" onClick={handleClose}>
              {t("cancel")}
            </SecondaryButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <PrimaryButton type="submit">{t("find.table")}</PrimaryButton>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
