import React from "react";
import cls from "./orderRefund.module.scss";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import refundService from "services/refund";
import { useRouter } from "next/router";
import TextInput from "components/inputs/textInput";
import PrimaryButton from "components/button/primaryButton";
import { error, success } from "components/alert/toast";

type Props = {
  handleClose: () => void;
};

type FormValues = {
  cause?: string;
};

export default function OrderRefund({ handleClose }: Props) {
  const { t } = useTranslation();
  const { query, push } = useRouter();
  const orderId = Number(query.id);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => refundService.create(data),
    onSuccess: () => {
      handleClose();
      success(t("request.sent"));
      push("/orders");
    },
    onError: () => {
      error(t("request.not.sent"));
    },
  });

  const formik = useFormik({
    initialValues: {
      cause: "",
    },
    onSubmit: (values: FormValues) => {
      console.log("values => ", values);
      const payload = {
        cause: values.cause,
        order_id: orderId,
      };
      mutate(payload);
    },
    validate: (values: FormValues) => {
      const errors: FormValues = {};
      if (!values.cause) {
        errors.cause = t("required");
      }
      return errors;
    },
  });

  return (
    <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
      <div className={cls.header}>
        <h2 className={cls.title}>{t("order.refund")}</h2>
      </div>
      <div className={cls.body}>
        <TextInput
          id="cause"
          name="cause"
          label={t("why.refund")}
          value={formik.values.cause}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
          error={!!formik.errors.cause && formik.touched.cause}
        />
      </div>
      <div className={cls.footer}>
        <div className={cls.btnWrapper}>
          <PrimaryButton type="submit" loading={isLoading}>
            {t("submit")}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
