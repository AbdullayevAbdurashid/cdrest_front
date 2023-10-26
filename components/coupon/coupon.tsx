import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import cls from "./coupon.module.scss";
import PrimaryButton from "components/button/primaryButton";
import TextInput from "components/inputs/textInput";
import { DoubleCheckIcon } from "components/icons";
import SecondaryButton from "components/button/secondaryButton";
import { FormikProps } from "formik";
import { OrderFormValues } from "interfaces";
import useDebounce from "hooks/useDebounce";
import { useMutation } from "react-query";
import orderService from "services/order";
import useDidUpdate from "hooks/useDidUpdate";
import { useAuth } from "contexts/auth/auth.context";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

type Props = {
  formik: FormikProps<OrderFormValues>;
  handleClose: () => void;
};

export default function Coupon({ formik, handleClose }: Props) {
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(!!formik.values.coupon);
  const [value, setValue] = useState(formik.values.coupon || "");
  const debouncedValue = useDebounce(value, 400);
  const { user } = useAuth();
  const { query } = useRouter();
  const shopId = Number(query.id);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => orderService.checkCoupon(data),
    onSuccess: () => setIsValid(true),
    onError: () => setIsValid(false),
  });

  useDidUpdate(() => {
    const payload = {
      coupon: debouncedValue,
      user_id: user.id,
      shop_id: shopId,
    };
    if (debouncedValue) {
      mutate(payload);
    } else {
      setIsValid(false);
    }
  }, [debouncedValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    formik.setFieldValue("coupon", debouncedValue);
    handleClose();
  };

  return (
    <div className={cls.wrapper}>
      <div className={cls.body}>
        <TextInput
          label={t("promo.code")}
          name="coupon"
          onChange={handleChange}
          value={value}
          InputProps={{
            endAdornment: isLoading ? (
              <CircularProgress size={22} />
            ) : isValid ? (
              <DoubleCheckIcon />
            ) : (
              ""
            ),
          }}
          error={!isValid && !!debouncedValue && !isLoading}
        />
      </div>
      <div className={cls.footer}>
        <div className={cls.action}>
          <PrimaryButton
            disabled={!isValid && !!debouncedValue}
            onClick={handleSubmit}
          >
            {t("save")}
          </PrimaryButton>
        </div>
        <div className={cls.action}>
          <SecondaryButton
            onClick={() => {
              setValue("");
              setIsValid(false);
            }}
          >
            {t("clear")}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
