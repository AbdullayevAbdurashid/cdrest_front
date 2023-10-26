import React, { useEffect } from "react";
import cls from "./verifyCodeForm.module.scss";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/button/primaryButton";
import { useFormik } from "formik";
import OtpCodeInput from "components/inputs/otpCodeInput";
import { useRouter } from "next/router";
import authService from "services/auth";
import { error, success } from "components/alert/toast";
import { setCookie } from "utils/session";
import { useAuth } from "contexts/auth/auth.context";
import { useMutation } from "react-query";
import { useCountDown } from "hooks/useCountDown";
import { useSettings } from "contexts/settings/settings.context";

type Props = {};
interface formValues {
  code?: string;
}

export default function VerifyCodeForm({}: Props) {
  const { t } = useTranslation();
  const { mutate: resend, isLoading: isResending } = useMutation({
    mutationFn: (data: { email: string }) =>
      authService.forgotPasswordEmail(data),
  });
  const { settings } = useSettings();
  const waitTime = settings.otp_expire_time * 60 || 60;
  const [time, timerStart, _, timerReset] = useCountDown(waitTime);
  const { query, push } = useRouter();
  const { setUserData } = useAuth();

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    onSubmit: (values: formValues, { setSubmitting }) => {
      authService
        .forgotPasswordVerify({
          verifyCode: values.code,
          email: query.email,
        })
        .then(({ data }) => {
          const token = "Bearer" + " " + data.token;
          setCookie("access_token", token);
          setUserData(data.user);
          push("/update-password");
        })
        .catch((err) => error(t(err.statusCode)))
        .finally(() => setSubmitting(false));
      console.log("values => ", values);
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
    resend(
      { email: query.email as string },
      {
        onSuccess: () => {
          timerReset();
          timerStart();
          success(t("verify.send"));
        },
        onError: (err: any) => {
          error(err.message);
        },
      }
    );
  };

  useEffect(() => {
    timerStart();
  }, []);

  return (
    <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
      <div className={cls.header}>
        <h1 className={cls.title}>{t("enter.otp.code")}</h1>
        <p className={cls.text}>
          {t("enter.code.text", { phone: query.email })}
        </p>
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
          isResending ? (
            <span className={cls.text} style={{ opacity: 0.5 }}>
              Sending...
            </span>
          ) : (
            <span onClick={handleResendCode} className={cls.resend}>
              {t("resend")}
            </span>
          )
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
