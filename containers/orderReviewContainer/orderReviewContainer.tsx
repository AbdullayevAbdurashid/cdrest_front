import React from "react";
import { useMediaQuery } from "@mui/material";
import ModalContainer from "containers/modal/modal";
import MobileDrawer from "containers/drawer/mobileDrawer";
import OrderReview from "components/orderReview/orderReview";

type Props = {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
};

export default function OrderReviewContainer({
  open,
  onClose,
  refetch,
}: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");

  if (isDesktop) {
    return (
      <ModalContainer open={open} onClose={onClose}>
        <OrderReview handleClose={onClose} refetch={refetch} />
      </ModalContainer>
    );
  } else {
    return (
      <MobileDrawer open={open} onClose={onClose}>
        <OrderReview handleClose={onClose} refetch={refetch} />
      </MobileDrawer>
    );
  }
}
