import { error, success } from "components/alert/toast";
import PrimaryButton from "components/button/primaryButton";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";
import cls from "./editPhone.module.scss";
import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useCountDown } from "hooks/useCountDown";
import { useSettings } from "contexts/settings/settings.context";
import { useAuth } from "contexts/auth/auth.context";
import profileService from "services/profile";
import dayjs from "dayjs";
import { selectCurrency } from "redux/slices/currency";
import { useAppSelector } from "hooks/useRedux";
import { useQueryClient } from "react-query";

interface formValues {
  verifyId?: string;
  verifyCode?: string;
}
type Props = {
  phone: string;
  callback?: any;
  setCallback?: (data: any) => void;
  handleClose: () => void;
};

export default function NewPhoneVerify({
  phone,
  callback,
  setCallback,
  handleClose,
}: Props) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const waitTime = settings.otp_expire_time * 60 || 60;
  const [time, timerStart, _, timerReset] = useCountDown(waitTime);
  const { phoneNumberSignIn, setUserData, user } = useAuth();
  const currency = useAppSelector(selectCurrency);
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values: formValues, { setSubmitting }) => {
      const payload = {
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: dayjs(user.birthday).format("YYYY-MM-DD"),
        gender: user.gender,
        phone: parseInt(phone),
      };
      callback
        .confirm(values.verifyId || "")
        .then(() => {
          profileService
            .updatePhone(payload)
            .then((res) => {
              setUserData(res.data);
              success(t("verified"));
              handleClose();
              queryClient.invalidateQueries(["profile", currency?.id]);
            })
            .catch((err) => {
              if (err?.data?.params?.phone) {
                error(err?.data?.params?.phone.at(0));
                return;
              }
              error(t('some.thing.went.wrong'))
            })
            .finally(() => setSubmitting(false));
        })
        .catch(() => error(t("verify.error")));
    },
    validate: (values: formValues) => {
      const errors: formValues = {};
      if (!values.verifyId) {
        errors.verifyId = t("required");
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
        <h1 className={cls.title}>{t("verify.phone")}</h1>
        <p className={cls.text}>
          {t("verify.text")} <i>{phone}</i>
        </p>
      </div>
      <div className={cls.space} />
      <Stack spacing={2}>
        <OtpInput
          numInputs={6}
          inputStyle={cls.input}
          isInputNum
          containerStyle={cls.otpContainer}
          value={formik.values.verifyId?.toString()}
          onChange={(otp: any) => formik.setFieldValue("verifyId", otp)}
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
      </Stack>
      <div className={cls.space} />
      <div className={cls.action}>
        <PrimaryButton
          type="submit"
          disabled={Number(formik?.values?.verifyId?.toString()?.length) < 6}
          loading={formik.isSubmitting}
        >
          {t("verify")}
        </PrimaryButton>
      </div>
    </form>
  );
}
