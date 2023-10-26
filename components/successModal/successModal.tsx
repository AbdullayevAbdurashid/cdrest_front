import React from "react";
import ModalContainer from "containers/modal/modal";
import cls from "./successModal.module.scss";
import { useTranslation } from "react-i18next";
import SecondaryButton from "components/button/secondaryButton";
import PrimaryButton from "components/button/primaryButton";
import { DoubleCheckIcon } from "components/icons";

type Props = {
  open: boolean;
  handleClose: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  title: string;
  buttonText: string;
};

export default function SuccessModal({
  open,
  handleClose,
  onSubmit,
  loading = false,
  title,
  buttonText,
}: Props) {
  const { t } = useTranslation();

  return (
    <ModalContainer open={open} onClose={handleClose} closable={false}>
      <div className={cls.wrapper}>
        <div className={cls.content}>
          <div className={cls.icon}>
            <DoubleCheckIcon />
          </div>
          <div className={cls.text}>{title}</div>
        </div>
        <div className={cls.actions}>
          <SecondaryButton onClick={handleClose}>{t("cancel")}</SecondaryButton>
          <PrimaryButton loading={loading} onClick={onSubmit}>
            {buttonText}
          </PrimaryButton>
        </div>
      </div>
    </ModalContainer>
  );
}
