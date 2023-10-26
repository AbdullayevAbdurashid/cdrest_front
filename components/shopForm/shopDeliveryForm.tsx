import React from "react";
import { Grid } from "@mui/material";
import TextInput from "components/inputs/textInput";
import SelectInput from "components/inputs/selectInput";
import { ShopFormType } from "interfaces";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";

type Props = {
  formik: FormikProps<ShopFormType>;
};

export default function ShopDeliveryForm({ formik }: Props) {
  const { t } = useTranslation();
  const {
    price,
    price_per_km,
    delivery_time_type,
    delivery_time_from,
    delivery_time_to,
  } = formik.values;

  const deliveryTimeTypes = [
    {
      label: t("minute"),
      value: "minute",
    },
    {
      label: t("hour"),
      value: "hour",
    },
  ];

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <SelectInput
          name="delivery_time_type"
          label={t("delivery_time_type")}
          placeholder={t("type.here")}
          value={delivery_time_type}
          onChange={formik.handleChange}
          options={deliveryTimeTypes}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          name="delivery_time_from"
          label={t("delivery_time_from")}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          value={delivery_time_from}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={
            !!formik.errors.delivery_time_from &&
            formik.touched.delivery_time_from
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          name="delivery_time_to"
          label={t("delivery_time_to")}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          value={delivery_time_to}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={
            !!formik.errors.delivery_time_to && formik.touched.delivery_time_to
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          name="price"
          label={t("start.price")}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          value={price}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.price && formik.touched.price}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          name="price_per_km"
          label={t("price_per_km")}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          value={price_per_km}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.price_per_km && formik.touched.price_per_km}
        />
      </Grid>
    </Grid>
  );
}
