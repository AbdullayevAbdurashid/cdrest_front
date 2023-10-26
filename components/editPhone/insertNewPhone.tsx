import React from "react";
import cls from "./editPhone.module.scss";
import { useTranslation } from "react-i18next";
import TextInput from "components/inputs/textInput";
import PrimaryButton from "components/button/primaryButton";
import { useFormik } from "formik";
import { error } from "components/alert/toast";
import { useAuth } from "contexts/auth/auth.context";

type EditPhoneViews = "EDIT" | "VERIFY";
type Props = {
  onSuccess: (data: any) => void;
  changeView: (view: EditPhoneViews) => void;
};
interface formValues {
  phone: string;
}

export default function InsertNewPhone({ onSuccess, changeView }: Props) {
  const { t } = useTranslation();
  const { phoneNumberSignIn } = useAuth();

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    onSubmit: (values: formValues, { setSubmitting }) => {
      const trimmedPhone = values.phone.replace(/[^0-9]/g, "");
      phoneNumberSignIn(values.phone)
        .then((confirmationResult) => {
          onSuccess({
            phone: trimmedPhone,
            callback: confirmationResult,
          });
          changeView("VERIFY");
        })
        .catch((err) => {
          error(t("sms.not.sent"));
          console.log("err => ", err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },

    validate: (values: formValues) => {
      const errors = {} as formValues;
      if (!values.phone) {
        errors.phone = t("required");
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.phone)
      )
        return errors;
    },
  });

  return (
    <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
      <div className={cls.header}>
        <h1 className={cls.title}>{t("edit.phone")}</h1>
      </div>
      <div className={cls.space} />
      <TextInput
        name="phone"
        label={t("phone")}
        placeholder={t("type.here")}
        value={formik.values.phone}
        onChange={formik.handleChange}
        error={!!formik.errors.phone}
        helperText={formik.errors.phone}
        required
      />
      <div className={cls.space} />
      <div className={cls.action}>
        <PrimaryButton
          id="sign-in-button"
          type="submit"
          loading={formik.isSubmitting}
        >
          {t("save")}
        </PrimaryButton>
      </div>
    </form>
  );
}
