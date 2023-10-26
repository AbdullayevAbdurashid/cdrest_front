import React from "react";
import cls from "./beSellerModal.module.scss";
import ModalContainer from "containers/modal/modal";
import { useTranslation } from "react-i18next";
import RefreshLineIcon from "remixicon-react/RefreshLineIcon";
import { useAuth } from "contexts/auth/auth.context";
import { DoubleCheckIcon } from "components/icons";
import PrimaryButton from "components/button/primaryButton";
import { ADMIN_PANEL_URL } from "constants/constants";

type Props = {
  open: boolean;
  handleClose: () => void;
};

export default function BeSellerModal({ open, handleClose }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isSeller = user?.role === "seller";

  const goToAdminPanel = () => {
    window.open(ADMIN_PANEL_URL, "_blank");
  };

  return (
    <ModalContainer open={open} onClose={handleClose}>
      <div className={cls.wrapper}>
        <div className={cls.icon}>
          {isSeller ? <DoubleCheckIcon /> : <RefreshLineIcon />}
        </div>
        <div className={cls.text}>
          {isSeller
            ? t("seller.request.accepted")
            : t("seller.request.under.review")}
        </div>
        {isSeller && (
          <PrimaryButton onClick={goToAdminPanel}>
            {t("go.to.admin.panel")}
          </PrimaryButton>
        )}
      </div>
    </ModalContainer>
  );
}
