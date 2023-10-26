import React from "react";
import cls from "./pickers.module.scss";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import useModal from "hooks/useModal";
import DeliveryAddressModal from "components/addressModal/deliveryAddressModal";
import { FormikProps } from "formik";
import { ParcelFormValues } from "interfaces/parcel.interface";
import { Location } from "interfaces";
import { useMediaQuery } from "@mui/material";

type Props = {
  addressKey?: string;
  locationKey?: string;
  address: string;
  location: Location;
  label?: string;
  formik: FormikProps<ParcelFormValues>;
  error?: boolean;
  type?: "standard" | "outlined";
  placeholder?: string;
  icon?: React.ReactElement;
};

export default function RcAddressPicker({
  address,
  location,
  locationKey,
  addressKey,
  formik,
  label,
  error,
  type = "outlined",
  placeholder,
  icon,
}: Props) {
  const [open, handleOpen, handleClose] = useModal();
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <div className={`${cls.container} ${cls[type]}`}>
      {!!label && <h4 className={cls.title}>{label}</h4>}
      <div
        className={`${cls.wrapper} ${error ? cls.error : ""}`}
        onClick={handleOpen}
      >
        <div className={`${cls.iconWrapper} ${cls.limited}`}>
          {icon}
          <span className={cls.text}>{address ? address : placeholder}</span>
        </div>
        <ArrowDownSLineIcon />
      </div>
      <DeliveryAddressModal
        open={open}
        checkZone={false}
        onClose={handleClose}
        addressKey={addressKey}
        locationKey={locationKey}
        address={address}
        formik={formik}
        latlng={location}
        fullScreen={!isDesktop}
      />
    </div>
  );
}
