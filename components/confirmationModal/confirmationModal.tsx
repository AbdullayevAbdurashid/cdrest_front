import React from "react";
import ModalContainer from "containers/modal/modal";
import cls from "./confirmationModal.module.scss";
import { useTranslation } from "react-i18next";
import SecondaryButton from "components/button/secondaryButton";
import PrimaryButton from "components/button/primaryButton";

type Props = {
  open: boolean;
  handleClose: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  title: string;
};

export default function ConfirmationModal({
  open,
  handleClose,
  onSubmit,
  loading = false,
  title,
}: Props) {
  const { t } = useTranslation();

  return (
    <ModalContainer open={open} onClose={handleClose} closable={false}>
      <div className={cls.wrapper}>
        <div className={cls.text}>{title}</div>
        <div className={cls.actions}>
          <SecondaryButton onClick={handleClose}>{t("no")}</SecondaryButton>
          <PrimaryButton loading={loading} onClick={onSubmit}>
            {t("yes")}
          </PrimaryButton>
        </div>
      </div>
    </ModalContainer>
  );
}
