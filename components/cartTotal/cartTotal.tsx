import React, { useState } from "react";
import PrimaryButton from "components/button/primaryButton";
import cls from "./cartTotal.module.scss";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Price from "components/price/price";
import { useAuth } from "contexts/auth/auth.context";
import useRouterStatus from "hooks/useRouterStatus";
import { IShop } from "interfaces";
import { useAppSelector } from "hooks/useRedux";
import { selectUserCart } from "redux/slices/userCart";
import useModal from "hooks/useModal";
import ConfirmationModal from "components/confirmationModal/confirmationModal";
import { info } from "components/alert/toast";
import { useShop } from "contexts/shop/shop.context";

type Props = {
  totalPrice: number;
  data: IShop;
};

export default function CartTotal({ totalPrice = 0 }: Props) {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { isAuthenticated } = useAuth();
  const { isLoading } = useRouterStatus();
  const cart = useAppSelector(selectUserCart);
  const [clicked, setClicked] = useState(false);
  const [openPrompt, handleOpenPrompt, handleClosePrompt] = useModal();
  const { isOpen } = useShop();

  function handleCheck() {
    if (!isOpen) {
      info(t("shop.closed"));
      return;
    }
    setClicked(true);
    if (isAuthenticated) {
      const members = cart.user_carts.filter(
        (item) => item.user_id !== cart.owner_id
      );
      const isMemberActive = members.some((item) => item.status);
      if (isMemberActive) {
        handleOpenPrompt();
        return;
      }
      goToCheckout();
    } else {
      push("/login");
    }
  }

  function goToCheckout() {
    push(`/restaurant/${cart.shop_id}/checkout`);
  }

  return (
    <div className={cls.wrapper}>
      <div className={cls.flex}>
        <div className={cls.item}>
          <div className={cls.label}>{t("total")}</div>
          <h4 className={cls.text}>
            <Price number={totalPrice} />
          </h4>
        </div>
      </div>
      <div className={cls.actions}>
        <PrimaryButton onClick={handleCheck} loading={isLoading && clicked}>
          {t("order")}
        </PrimaryButton>
      </div>
      <ConfirmationModal
        open={openPrompt}
        handleClose={handleClosePrompt}
        onSubmit={goToCheckout}
        loading={isLoading}
        title={t("group.order.permission")}
      />
    </div>
  );
}
