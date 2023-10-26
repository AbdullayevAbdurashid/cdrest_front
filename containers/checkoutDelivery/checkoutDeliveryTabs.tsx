import React from "react";
import cls from "./checkoutDelivery.module.scss";
import { FormikProps } from "formik";
import { OrderFormValues, IShop } from "interfaces";
import { useTranslation } from "react-i18next";
import { useSettings } from "contexts/settings/settings.context";

type Props = {
  formik: FormikProps<OrderFormValues>;
  data: IShop;
};

export default function CheckoutDeliveryTabs({ data, formik }: Props) {
  const { t } = useTranslation();
  const { delivery_type } = formik.values;
  const { address, location } = useSettings();
  const latlng = location;

  const handleChangeTypes = (key: string) => {
    formik.setFieldValue("delivery_type", key);
    if (key === "pickup") {
      formik.setFieldValue("location", data.location);
      formik.setFieldValue("address.address", data.translation.address);
    } else {
      const userLocation = {
        latitude: latlng?.split(",")[0],
        longitude: latlng?.split(",")[1],
      };
      formik.setFieldValue("location", userLocation);
      formik.setFieldValue("address.address", address);
    }
  };

  return (
    <div className={cls.tabs}>
      <button
        type="button"
        className={`${cls.tab} ${
          delivery_type === "delivery" ? cls.active : ""
        }`}
        onClick={() => handleChangeTypes("delivery")}
      >
        <span className={cls.text}>{t("delivery")}</span>
      </button>
      <button
        type="button"
        className={`${cls.tab} ${delivery_type === "pickup" ? cls.active : ""}`}
        onClick={() => handleChangeTypes("pickup")}
      >
        <span className={cls.text}>{t("pickup")}</span>
      </button>
    </div>
  );
}
