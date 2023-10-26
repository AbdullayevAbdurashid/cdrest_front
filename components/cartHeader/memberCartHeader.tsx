import React from "react";
import cls from "./cartHeader.module.scss";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import { useTranslation } from "react-i18next";
import ClearCartModal from "components/clearCartModal/clearCartModal";
import useModal from "hooks/useModal";
import { CartType, UserCart } from "interfaces";
import { useMutation } from "react-query";
import cartService from "services/cart";
import { useAppDispatch } from "hooks/useRedux";
import { updateUserCart } from "redux/slices/userCart";
import { useShop } from "contexts/shop/shop.context";

type Props = {
  data: UserCart;
  cart: CartType;
};

export default function MemberCartHeader({ data, cart }: Props) {
  const { t } = useTranslation();
  const [openModal, handleOpen, handleClose] = useModal();
  const dispatch = useAppDispatch();
  const { member } = useShop();

  const { mutate: deleteProducts, isLoading } = useMutation({
    mutationFn: (data: any) => cartService.deleteGuestProducts(data),
    onSuccess: () => {
      let newCart = JSON.parse(JSON.stringify(cart));
      const cartIdx = cart.user_carts.findIndex((item) => item.id === data.id);
      newCart.user_carts[cartIdx].cartDetails = [];
      dispatch(updateUserCart(newCart));
      handleClose();
    },
  });

  function clearCartItems() {
    const ids = data.cartDetails.map((item) => item.id);
    deleteProducts({ ids });
  }

  return (
    <div className={cls.header}>
      <h2 className={cls.title}>
        {data.uuid === member?.uuid ? t("your.orders") : data.name}
        {data.user_id === cart.owner_id ? ` (${t("owner")})` : ""}
      </h2>
      {data.cartDetails.length > 0 && data.uuid === member?.uuid && (
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
