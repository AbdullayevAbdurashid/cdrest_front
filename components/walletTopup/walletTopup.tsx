import React from "react";
import cls from "./walletTopup.module.scss";
import { Grid, useMediaQuery } from "@mui/material";
import TextInput from "components/inputs/textInput";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import PrimaryButton from "components/button/primaryButton";
import DarkButton from "components/button/darkButton";
import { useMutation } from "react-query";
import profileService from "services/profile";
import { error, success } from "components/alert/toast";

type Props = {
  handleClose: () => void;
};
interface formValues {
  price: number | null;
  note: string;
}

export default function WalletTopup({ handleClose }: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => profileService.passwordUpdate(data),
    onSuccess: (data) => {
      success(t("saved"));
      handleClose();
    },
    onError: (err: any) => error(t(err.statusCode)),
  });

  const formik = useFormik({
    initialValues: {
      price: null,
      note: "",
    },
    onSubmit: (values: formValues, { setSubmitting }) => {
      console.log("values => ", values);
      handleClose();
      //   mutate(values);
    },
    validate: (values: formValues) => {
      const errors = {} as formValues;
      if (!values.price) {
        errors.price = t("required");
      }
      if (!values.note) {
        errors.note = t("required");
      }
      return errors;
    },
  });

  return (
    <div className={cls.wrapper}>
      <h1 className={cls.title}>{t("topup.wallet")}</h1>
      <form className={cls.form} onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextInput
              name="price"
              type="number"
              label={t("price")}
              placeholder={t("type.here")}
              value={formik.values.price}
              onChange={formik.handleChange}
              error={!!formik.errors.price && formik.touched.price}
            />
            <div style={{ color: "red", fontSize: "14px" }}>
              {formik.errors?.price && formik.touched?.price
                ? formik.errors?.price
                : ""}
            </div>
          </Grid>
          <Grid item xs={12} md={12}>
            <TextInput
              name="note"
              label={t("note")}
              placeholder={t("type.here")}
              value={formik.values.note}
              onChange={formik.handleChange}
              error={!!formik.errors.note && formik.touched.note}
            />
            <div style={{ color: "red", fontSize: "14px" }}>
              {formik.errors?.note && formik.touched?.note
                ? formik.errors?.note
                : ""}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <PrimaryButton type="submit" loading={isLoading}>
              {t("save")}
            </PrimaryButton>
          </Grid>
          <Grid item xs={12} md={6} mt={isDesktop ? 0 : -2}>
            <DarkButton type="button" onClick={handleClose}>
              {t("cancel")}
            </DarkButton>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
