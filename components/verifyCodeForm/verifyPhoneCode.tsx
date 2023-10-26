import React, { useEffect } from "react";
import cls from "./verifyCodeForm.module.scss";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/button/primaryButton";
import { useFormik } from "formik";
import OtpCodeInput from "components/inputs/otpCodeInput";
import { useRouter } from "next/router";
import { error, success } from "components/alert/toast";
import { useAuth } from "contexts/auth/auth.context";
import { useCountDown } from "hooks/useCountDown";
import { useSettings } from "contexts/settings/settings.context";
import authService from "services/auth";
import { setCookie } from "utils/session";

type RegisterViews = "RESET" | "VERIFY";
type Props = {
  phone: string;
  callback: any;
  setCallback: any;
  changeView: (view: RegisterViews) => void;
};
interface formValues {
  code?: string;
}

export default function VerifyPhoneCode({
  phone,
  callback,
  setCallback,
}: Props) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const waitTime = settings.otp_expire_time * 60 || 60;
  const [time, timerStart, _, timerReset] = useCountDown(waitTime);
  const { push } = useRouter();
  const { phoneNumberSignIn, setUserData } = useAuth();

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    onSubmit: (values: formValues, { setSubmitting }) => {
      callback
        .confirm(values.code || "")
        .then(() => {
          authService
            .forgotPasswordPhone({ phone, type: "firebase" })
            .then(({ data }) => {
              const token = "Bearer" + " " + data.token;
              setCookie("access_token", token);
              setUserData(data.user);
              push("/update-password");
            })
            .catch(() => error(t("verify.error")))
            .finally(() => setSubmitting(false));
        })
        .catch(() => {
          error(t("verify.error"));
          setSubmitting(false);
        });
    },
    validate: (values: formValues) => {
      const errors: formValues = {};
      if (!values.code) {
        errors.code = t("required");
      }
      return errors;
    },
  });

  const handleResendCode = () => {
    phoneNumberSignIn(phone)
      .then((confirmationResult) => {
        timerReset();
        timerStart();
        success(t("verify.send"));
        if (setCallback) setCallback(confirmationResult);
      })
      .catch(() => error(t("sms.not.sent")));
  };

  useEffect(() => {
    timerStart();
  }, []);

  return (
    <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
      <div className={cls.header}>
        <h1 className={cls.title}>{t("enter.otp.code")}</h1>
        <p className={cls.text}>{t("enter.code.text", { phone })}</p>
      </div>

      <div className={cls.space} />
      <OtpCodeInput
        value={formik.values.code}
        onChange={(otp: string) => formik.setFieldValue("code", otp)}
        numInputs={6}
        isInputNum
        containerStyle={cls.otpContainer}
        hasErrored={!!formik.errors.code}
      />
      <p className={cls.text}>
        {t("verify.didntRecieveCode")}{" "}
        {time === 0 ? (
          <span
            id="sign-in-button"
            onClick={handleResendCode}
            className={cls.resend}
          >
            {t("resend")}
          </span>
        ) : (
          <span className={cls.text}>{time} s</span>
        )}
      </p>
      <div className={cls.space} />
      <div className={cls.actions}>
        <div className={cls.item}>
          <PrimaryButton
            type="submit"
            disabled={Number(formik.values.code?.length) < 6}
            loading={formik.isSubmitting}
          >
            {t("confirm")}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
