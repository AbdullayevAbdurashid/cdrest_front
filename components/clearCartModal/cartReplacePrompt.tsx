import React from "react";
import ModalContainer from "containers/modal/modal";
import cls from "./clearCartModal.module.scss";
import { useTranslation } from "react-i18next";
import SecondaryButton from "components/button/secondaryButton";
import PrimaryButton from "components/button/primaryButton";

type Props = {
  open: boolean;
  handleClose: () => void;
  onSubmit?: () => void;
  loading?: boolean;
};

export default function CartReplaceModal({
  open,
  handleClose,
  onSubmit,
  loading = false,
}: Props) {
  const { t } = useTranslation();

  return (
    <ModalContainer open={open} onClose={handleClose} closable={false}>
      <div className={cls.wrapper}>
        <div className={cls.text}>{t("replace.cart.prompt")}</div>
        <div className={cls.actions}>
          <SecondaryButton onClick={handleClose}>{t("cancel")}</SecondaryButton>
          <PrimaryButton loading={loading} onClick={onSubmit}>
            {t("clear")}
          </PrimaryButton>
        </div>
      </div>
    </ModalContainer>
  );
}
