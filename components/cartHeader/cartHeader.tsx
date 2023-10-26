import React from "react";
import cls from "./cartHeader.module.scss";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import { useTranslation } from "react-i18next";
import ClearCartModal from "components/clearCartModal/clearCartModal";
import useModal from "hooks/useModal";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { clearCart, selectCart } from "redux/slices/cart";

type Props = {};

export default function CartHeader({}: Props) {
  const { t } = useTranslation();
  const [openModal, handleOpen, handleClose] = useModal();
  const cartItems = useAppSelector(selectCart);
  const dispatch = useAppDispatch();

  function clearCartItems() {
    dispatch(clearCart());
    handleClose();
  }

  return (
    <div className={cls.header}>
      <h2 className={cls.title}>{t("your.orders")}</h2>
      {cartItems.length > 0 && (
        <button type="button" className={cls.trashBtn} onClick={handleOpen}>
          <DeleteBinLineIcon />
        </button>
      )}
      <ClearCartModal
        open={openModal}
        handleClose={handleClose}
        onSubmit={clearCartItems}
      />
    </div>
  );
}
