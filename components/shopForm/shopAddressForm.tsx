import React, { useRef, useEffect } from "react";
import cls from "./shopForm.module.scss";
import { Grid } from "@mui/material";
import TextInput from "components/inputs/textInput";
import { ShopFormType } from "interfaces";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import Map from "components/map/map";
import PrimaryButton from "components/button/primaryButton";

type Props = {
  children?: any;
  formik: FormikProps<ShopFormType>;
  lang: string;
  loading?: boolean;
};

export default function ShopAddressForm({ formik, lang, loading }: Props) {
  const { t } = useTranslation();
  const { address, location } = formik.values;
  const inputRef = useRef<HTMLInputElement>(null);

  const locationObj = {
    lat: Number(location?.split(",")[0]),
    lng: Number(location?.split(",")[1]),
  };

  function setLocation(latlng: any) {
    const value = `${latlng.lat},${latlng.lng}`;
    formik.setFieldValue("location", value);
  }

  function setAddress(text?: string) {
    formik.setFieldValue(`address.${lang}`, text);
  }

  useEffect(() => {
    setAddress(inputRef.current?.value);
  }, [location]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <TextInput
          name={`address.${lang}`}
          label={t("address")}
          placeholder={t("type.here")}
          defaultValue={address[lang]}
          inputRef={inputRef}
        />
      </Grid>
      <Grid item xs={12}>
        <div className={cls.map}>
          <Map
            location={locationObj}
            setLocation={setLocation}
            inputRef={inputRef}
          />
        </div>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <PrimaryButton type="submit" loading={loading}>
          {t("submit")}
        </PrimaryButton>
      </Grid>
    </Grid>
  );
}
