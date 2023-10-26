import React from "react";
import cls from "./groupOrderButton.module.scss";
import { useShop } from "contexts/shop/shop.context";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { useTranslation } from "react-i18next";
import { clearUserCart, selectUserCart } from "redux/slices/userCart";
import Group2LineIcon from "remixicon-react/Group2LineIcon";
import ListSettingsLineIcon from "remixicon-react/ListSettingsLineIcon";
import LogoutBoxLineIcon from "remixicon-react/LogoutBoxLineIcon";
import { useMediaQuery } from "@mui/material";
import useModal from "hooks/useModal";
import ModalContainer from "containers/modal/modal";
import MobileDrawer from "containers/drawer/mobileDrawer";
import GroupOrderCard from "components/groupOrderCard/groupOrderCard";
import ConfirmationModal from "components/confirmationModal/confirmationModal";
import { useMutation } from "react-query";
import cartService from "services/cart";

type Props = {};

export default function GroupOrderButton({}: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const cart = useAppSelector(selectUserCart);
  const { isMember, member, clearMember } = useShop();
  const dispatch = useAppDispatch();
  const [groupOrderModal, handleOpenGroupModal, handleCloseGroupModal] =
    useModal();
  const [openModal, handleOpenModal, handleCloseModal] = useModal();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => cartService.guestLeave(data),
    onSuccess: () => {
      dispatch(clearUserCart());
      clearMember();
      handleCloseModal();
    },
  });

  function leaveGroup() {
    mutate({ ids: [member?.uuid], cart_id: cart.id });
  }

  return (
    <div>
      {isMember ? (
        <button type="button" className={cls.button} onClick={handleOpenModal}>
          <LogoutBoxLineIcon />
          <span className={cls.text}>{t("leave.group")}</span>
        </button>
      ) : cart.group ? (
        <button
          type="button"
          className={`${cls.button} ${cls.green}`}
          onClick={handleOpenGroupModal}
        >
          <ListSettingsLineIcon />
          <span className={cls.text}>{t("manage.order")}</span>
        </button>
      ) : (
        <button
          type="button"
          className={cls.button}
          onClick={handleOpenGroupModal}
        >
          <Group2LineIcon />
          <span className={cls.text}>{t("start.group.order")}</span>
        </button>
      )}

      {isDesktop ? (
        <ModalContainer open={groupOrderModal} onClose={handleCloseGroupModal}>
          {groupOrderModal && (
            <GroupOrderCard handleClose={handleCloseGroupModal} />
          )}
        </ModalContainer>
      ) : (
        <MobileDrawer open={groupOrderModal} onClose={handleCloseGroupModal}>
          {groupOrderModal && (
            <GroupOrderCard handleClose={handleCloseGroupModal} />
          )}
        </MobileDrawer>
      )}

      <ConfirmationModal
        open={openModal}
        handleClose={handleCloseModal}
        onSubmit={leaveGroup}
        loading={isLoading}
        title={t("are.you.sure.leave.group")}
      />
    </div>
  );
}
