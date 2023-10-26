import React from "react";
import cls from "./cartHeader.module.scss";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import { useTranslation } from "react-i18next";
import ClearCartModal from "components/clearCartModal/clearCartModal";
import useModal from "hooks/useModal";
import { UserCart } from "interfaces";
import { useMutation } from "react-query";
import cartService from "services/cart";
import { useAppDispatch } from "hooks/useRedux";
import { clearUserCart } from "redux/slices/userCart";

type Props = {
  data: UserCart;
  isOwner: boolean;
};

export default function ProtectedCartHeader({ data, isOwner }: Props) {
  const { t } = useTranslation();
  const [openModal, handleOpen, handleClose] = useModal();
  const dispatch = useAppDispatch();

  const { mutate: deleteCart, isLoading } = useMutation({
    mutationFn: (data: any) => cartService.delete(data),
    onSuccess: () => {
      dispatch(clearUserCart());
      handleClose();
    },
  });

  function clearCartItems() {
    const ids = [data.cart_id];
    deleteCart({ ids });
  }

  return (
    <div className={cls.header}>
      <h2 className={cls.title}>{isOwner ? t("your.orders") : data.name}</h2>
      {data.cartDetails.length > 0 && !!data.user_id && (
        <button type="button" className={cls.trashBtn} onClick={handleOpen}>
          <DeleteBinLineIcon />
        </button>
      )}

      <ClearCartModal
        open={openModal}
        handleClose={handleClose}
        onSubmit={clearCartItems}
        loading={isLoading}
      />
    </div>
  );
}
