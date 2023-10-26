import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RadioInput from "components/inputs/radioInput";
import cls from "./paymentMethod.module.scss";
import PrimaryButton from "components/button/primaryButton";
import { Payment } from "interfaces";

type Props = {
  value?: string;
  list: Payment[];
  handleClose: () => void;
  onSubmit: (tag?: string) => void;
  isButtonLoading?: boolean;
};

export default function PaymentMethod({
  value,
  list,
  onSubmit,
  isButtonLoading = false,
}: Props) {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    id: item,
    name: "payment_method",
    inputProps: { "aria-label": item },
  });

  return (
    <div className={cls.wrapper}>
      <div className={cls.body}>
        {list.map((item) => (
          <div key={item.id} className={cls.row}>
            <RadioInput {...controlProps(item.tag)} />
            <label className={cls.label} htmlFor={item.tag}>
              <span className={cls.text}>{t(item.tag)}</span>
            </label>
          </div>
        ))}
      </div>
      <div className={cls.footer}>
        <div className={cls.action}>
          <PrimaryButton
            loading={isButtonLoading}
            onClick={() => onSubmit(selectedValue)}
          >
            {t("save")}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}