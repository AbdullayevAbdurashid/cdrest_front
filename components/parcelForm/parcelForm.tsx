import React from "react";
import { Grid } from "@mui/material";
import { FormikProps } from "formik";
import { ParcelFormValues, ParcelType } from "interfaces/parcel.interface";
import useLocale from "hooks/useLocale";
import RcSelect from "components/pickers/rcSelect";
import getTimeSlots from "utils/getTimeSlots";
import RcParcelPicker from "components/pickers/rcParcelPicker";
import { BoxLineIcon, PickupFromIcon } from "components/icons";
import TimeLineIcon from "remixicon-react/TimeLineIcon";
import RcDateTimePicker from "components/pickers/rcDateTimePicker";
import BankCardLineIcon from "remixicon-react/BankCardLineIcon";
import RcAddressPicker from "components/pickers/rcAddressPicker";
import MapPinRangeLineIcon from "remixicon-react/MapPinRangeLineIcon";

type Props = {
  formik: FormikProps<ParcelFormValues>;
  types: {
    label: string;
    value: string;
    data: ParcelType;
  }[];
  loading?: boolean;
  payments?: {
    label: string;
    value: string;
  }[];
  handleSelectType: (value: ParcelType) => void;
};

export default function ParcelForm({
  formik,
  types,
  loading,
  payments,
  handleSelectType,
}: Props) {
  const { t } = useLocale();
  const {
    location_from,
    location_to,
    type_id,
    delivery_date,
    delivery_time,
    address_from,
    address_to,
  } = formik.values;

  return (
    <Grid container spacing={3} columns={{ xs: 12, md: 12, lg: 15 }}>
      <Grid item xs={12} lg={3} md={6}>
        <RcAddressPicker
          formik={formik}
          address={address_from}
          location={location_from}
          locationKey="location_from"
          addressKey="address_from"
          icon={<PickupFromIcon />}
          label={t('pickup.from')}
          type="outlined"
        />
      </Grid>
      <Grid item xs={12} lg={3} md={6}>
        <RcAddressPicker
          formik={formik}
          address={address_to}
          location={location_to}
          label={t("delivery.to")}
          locationKey="location_to"
          addressKey="address_to"
          icon={<MapPinRangeLineIcon />}
          type="outlined"
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4}>
        <RcParcelPicker
          type="outlined"
          name="type_id"
          icon={<BoxLineIcon />}
          label={t("type")}
          value={type_id}
          options={types}
          onChange={(event: any) => {
            const findedType = types.find(
              (type) => type.value.toString() === event.target.value
            )?.data;
            if (findedType) {
              handleSelectType(findedType);
            }
            formik.handleChange(event);
          }}
          error={!!formik.errors.type_id && formik.touched.type_id}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4}>
        <RcDateTimePicker
          type="outlined"
          name="delivery_time"
          label={t("delivery.date")}
          icon={<TimeLineIcon />}
          date={delivery_date}
          onDateChange={(event) => {
            formik.setFieldValue("delivery_date", event);
          }}
          error={!!formik.errors.delivery_date && formik.touched.delivery_date}
          time={delivery_time}
          options={getTimeSlots("06:00", "23:00", false, 60).map((el) => ({
            label: el,
            value: el,
          }))}
          onTimeChange={(event: any) => formik.handleChange(event)}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4}>
        <RcSelect
          type="outlined"
          icon={<BankCardLineIcon />}
          name="payment_type_id"
          label={t("payment.type")}
          value={formik.values.payment_type_id}
          options={payments}
          onChange={(event: any) => formik.handleChange(event)}
          error={
            !!formik.errors.payment_type_id && formik.touched.payment_type_id
          }
        />
      </Grid>
    </Grid>
  );
}
