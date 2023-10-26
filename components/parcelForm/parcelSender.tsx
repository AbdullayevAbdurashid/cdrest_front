import React from "react";
import cls from "./parcelForm.module.scss";
import { Grid, useMediaQuery } from "@mui/material";
import TextInput from "components/inputs/textInput";
import { FormikProps } from "formik";
import { ParcelFormValues } from "interfaces/parcel.interface";
import useLocale from "hooks/useLocale";
import useModal from "hooks/useModal";
import DeliveryAddressModal from "components/addressModal/deliveryAddressModal";
import PencilFillIcon from "remixicon-react/PencilFillIcon";
import { PickupFromIcon } from "components/icons";

type Props = {
  formik: FormikProps<ParcelFormValues>;
};

export default function ParcelSenderForm({ formik }: Props) {
  const { t } = useLocale();
  const { username_from, phone_from, address_from, location_from } =
    formik.values;
  const [addressModal, handleOpenAddressModal, handleCloseAddressModal] =
    useModal();
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <button
            type="button"
            className={cls.rowBtn}
            onClick={handleOpenAddressModal}
          >
            <div className={cls.item}>
              <PickupFromIcon />
              <div className={cls.naming}>
                <div className={cls.label}>{t("address")}</div>
                <div className={cls.value}>{address_from}</div>
              </div>
            </div>
            <div className={cls.icon}>
              <PencilFillIcon />
            </div>
          </button>
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="phone_from"
            label={t("phone")}
            value={phone_from}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.phone_from && formik.touched.phone_from}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="username_from"
            label={t("username")}
            value={username_from}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={
              !!formik.errors.username_from && formik.touched.username_from
            }
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <TextInput
            name="house_from"
            label={t("house")}
            value={formik.values.house_from}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.house_from && formik.touched.house_from}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="stage_from"
            label={t("stage")}
            value={formik.values.stage_from}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.stage_from && formik.touched.stage_from}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="room_from"
            label={t("room")}
            value={formik.values.room_from}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.room_from && formik.touched.room_from}
          />
        </Grid>

        <Grid item xs={12}>
          <TextInput
            name="note"
            label={t("comment")}
            value={formik.values.note}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.note && formik.touched.note}
          />
        </Grid>
      </Grid>
      <DeliveryAddressModal
        address={address_from}
        addressKey="address_from"
        locationKey="location_from"
        formik={formik}
        checkZone={false}
        open={addressModal}
        onClose={handleCloseAddressModal}
        latlng={location_from}
        fullScreen={!isDesktop}
        title={'select.address'}
      />
    </>
  );
}
