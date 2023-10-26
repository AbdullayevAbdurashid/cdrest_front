import React from "react";
import useModal from "hooks/useModal";
import { useTranslation } from "react-i18next";
import Refund2LineIcon from "remixicon-react/Refund2LineIcon";
import cls from "./orderRefundContainer.module.scss";
import { useMediaQuery } from "@mui/material";
import ModalContainer from "containers/modal/modal";
import OrderRefund from "components/orderRefund/orderRefund";
import MobileDrawer from "containers/drawer/mobileDrawer";

type Props = {};

export default function OrderRefundContainer({}: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const [openRefund, handleOpenRefund, handleCloseRefund] = useModal();

  return (
    <div>
      <button type="button" className={cls.textBtn} onClick={handleOpenRefund}>
        <Refund2LineIcon />
        <span className={cls.text}>{t("refund")}</span>
      </button>

      {isDesktop ? (
        <ModalContainer open={openRefund} onClose={handleCloseRefund}>
          <OrderRefund handleClose={handleCloseRefund} />
        </ModalContainer>
      ) : (
        <MobileDrawer open={openRefund} onClose={handleCloseRefund}>
          <OrderRefund handleClose={handleCloseRefund} />
        </MobileDrawer>
      )}
    </div>
  );
}
