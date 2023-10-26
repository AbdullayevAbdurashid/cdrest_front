import React from "react";
import cls from "./updatePasswordForm.module.scss";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/button/primaryButton";
import { useFormik } from "formik";
import PasswordInput from "components/inputs/passwordInput";
import profileService from "services/profile";
import { useRouter } from "next/router";
import { error } from "components/alert/toast";

type Props = {};
interface formValues {
  password?: string;
  password_confirmation?: string;
}

export default function UpdatePasswordForm({}: Props) {
  const { t } = useTranslation();
  const { push } = useRouter();

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    onSubmit: (values: formValues, { setSubmitting }) => {
      profileService
        .passwordUpdate(values)
        .then(() => {
          push("/");
        })
        .catch((err) => error(t(err.message)))
        .finally(() => setSubmitting(false));
    },
    validate: (values: formValues) => {
      const errors: formValues = {};
      if (!values.password) {
        errors.password = t("required");
      }
      if (!values.password_confirmation) {
        errors.password_confirmation = t("required");
      }
      return errors;
    },
  });

  return (
    <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
      <div className={cls.header}>
        <h1 className={cls.title}>{t("update.password")}</h1>
      </div>
      <div className={cls.space} />
      <PasswordInput
        name="password"
        label={t("password")}
        placeholder={t("type.here")}
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      <div className={cls.space} />
      <PasswordInput
        name="password_confirmation"
        label={t("password.confirmation")}
        placeholder={t("type.here")}
        value={formik.values.password_confirmation}
        onChange={formik.handleChange}
      />
      <div className={cls.space} />
      <div className={cls.action}>
        <PrimaryButton type="submit" loading={formik.isSubmitting}>
          {t("submit")}
        </PrimaryButton>
      </div>
    </form>
  );
}
