import React from "react";
import { useMediaQuery } from "@mui/material";
import useModal from "hooks/useModal";
import JoinGroupCard from "components/groupOrderCard/joinGroupCard";
import ModalContainer from "containers/modal/modal";
import MobileDrawer from "containers/drawer/mobileDrawer";
import { useShop } from "contexts/shop/shop.context";

type Props = {};

export default function JoinGroupContainer({}: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { isMember } = useShop();
  const [joinGroupModal, handleOpenModal, handleCloseModal] = useModal(
    !isMember
  );

  return (
    <div>
      {isDesktop ? (
        <ModalContainer open={joinGroupModal} onClose={handleCloseModal}>
          <JoinGroupCard handleClose={handleCloseModal} />
        </ModalContainer>
      ) : (
        <MobileDrawer open={joinGroupModal} onClose={handleCloseModal}>
          <JoinGroupCard handleClose={handleCloseModal} />
        </MobileDrawer>
      )}
    </div>
  );
}
