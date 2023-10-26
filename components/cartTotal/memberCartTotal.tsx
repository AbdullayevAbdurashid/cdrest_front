import React, { useState } from "react";
import PrimaryButton from "components/button/primaryButton";
import cls from "./cartTotal.module.scss";
import { useTranslation } from "react-i18next";
import Price from "components/price/price";
import { IShop } from "interfaces";
import { useAppSelector } from "hooks/useRedux";
import { selectUserCart } from "redux/slices/userCart";
import { useShop } from "contexts/shop/shop.context";
import SecondaryButton from "components/button/secondaryButton";
import { useMutation } from "react-query";
import cartService from "services/cart";

type Props = {
  totalPrice: number;
  data: IShop;
};

export default function MemberCartTotal({ totalPrice = 0 }: Props) {
  const { t } = useTranslation();
  const cart = useAppSelector(selectUserCart);
  const { member } = useShop();
  const memberObj = cart.user_carts.find((item) => item.uuid === member?.uuid);
  const [active, setActive] = useState(memberObj?.status);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) =>
      cartService.statusChange(member?.uuid || "", data),
    onSuccess: () => {
      setActive(!active);
    },
  });

  function changeMemberStatus() {
    mutate({ cart_id: cart.id });
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
        {active ? (
          <PrimaryButton onClick={changeMemberStatus} loading={isLoading}>
            {t("done")}
          </PrimaryButton>
        ) : (
          <SecondaryButton onClick={changeMemberStatus} loading={isLoading}>
            {t("edit.order")}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}
