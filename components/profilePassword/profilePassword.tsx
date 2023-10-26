import React from "react";
import cls from "./profilePassword.module.scss";
import { Grid, useMediaQuery } from "@mui/material";
import PasswordInput from "components/inputs/passwordInput";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import PrimaryButton from "components/button/primaryButton";
import DarkButton from "components/button/darkButton";
import { useMutation } from "react-query";
import profileService from "services/profile";
import { error, success } from "components/alert/toast";
import { useAuth } from "contexts/auth/auth.context";

type Props = {
  handleClose: () => void;
};
interface formValues {
  old_password?: string;
  password?: string;
  password_confirmation?: string;
}

export default function ProfilePassword({ handleClose }: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { user } = useAuth();

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
      old_password: "",
      password: "",
      password_confirmation: "",
    },
    onSubmit: (values: formValues, { setSubmitting }) => {
      console.log("values => ", values);
      mutate(values);
    },
    validate: (values: formValues) => {
      const errors: formValues = {};
      if (!values.old_password && !user?.empty_p) {
        errors.old_password = t("required");
      }
      if (!values.password) {
        errors.password = t("required");
      } else if (values.password.replace(/\s/g, "").length < 6) {
        errors.password = t("password.should.contain");
      }
      if (!values.password_confirmation) {
        errors.password_confirmation = t("required");
      } else if (values.password !== values.password_confirmation) {
        errors.password_confirmation = t("passwords.dont.match");
      }
      return errors;
    },
  });

  return (
    <div className={cls.wrapper}>
      <h1 className={cls.title}>{t("update.password")}</h1>
      <form className={cls.form} onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          {!user?.empty_p && (
            <Grid item xs={12} md={6}>
              <PasswordInput
                name="old_password"
                label={t("old.password")}
                placeholder={t("type.here")}
                value={formik.values.old_password}
                onChange={formik.handleChange}
                error={
                  !!formik.errors.old_password && formik.touched.old_password
                }
              />
              <div style={{ color: "red", fontSize: "14px" }}>
                {formik.errors?.old_password && formik.touched?.old_password
                  ? formik.errors?.old_password
                  : ""}
              </div>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <PasswordInput
              name="password"
              label={t("password")}
              placeholder={t("type.here")}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={!!formik.errors.password && formik.touched.password}
            />
            <div style={{ color: "red", fontSize: "14px" }}>
              {formik.errors?.password && formik.touched?.password
                ? formik.errors?.password
                : ""}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <PasswordInput
              name="password_confirmation"
              label={t("password.confirmation")}
              placeholder={t("type.here")}
              value={formik.values.password_confirmation}
              onChange={formik.handleChange}
              error={
                !!formik.errors.password_confirmation &&
                formik.touched.password_confirmation
              }
            />
            <div style={{ color: "red", fontSize: "14px" }}>
              {formik.errors?.password_confirmation &&
              formik.touched?.password_confirmation
                ? formik.errors?.password_confirmation
                : ""}
            </div>
          </Grid>
          {!user?.empty_p && <Grid item xs={12} md={6}></Grid>}
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
