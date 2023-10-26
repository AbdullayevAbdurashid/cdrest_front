import React from "react";
import cls from "./cart.module.scss";
import CartServices from "components/cartServices/cartServices";
import EmptyCart from "components/emptyCart/emptyCart";
import { IShop, UserCart } from "interfaces";
import { useQuery } from "react-query";
import cartService from "services/cart";
import Loading from "components/loader/loading";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import {
  clearUserCart,
  selectUserCart,
  updateUserCart,
} from "redux/slices/userCart";
import { useShop } from "contexts/shop/shop.context";
import MemberCartHeader from "components/cartHeader/memberCartHeader";
import MemberCartProduct from "components/cartProduct/memberCartProduct";
import MemberCartTotal from "components/cartTotal/memberCartTotal";
import { warning } from "components/alert/toast";
import { useTranslation } from "react-i18next";
import { selectCurrency } from "redux/slices/currency";

type Props = {
  shop: IShop;
};

export default function MemberCart({ shop }: Props) {
  const { t } = useTranslation();
  const cart = useAppSelector(selectUserCart);
  const dispatch = useAppDispatch();
  const isEmpty = !cart?.user_carts?.some((item) => item.cartDetails.length);
  const { member, clearMember } = useShop();
  const currency = useAppSelector(selectCurrency);

  const { isLoading } = useQuery(
    ["cart", member, currency?.id],
    () =>
      cartService.guestGet(member?.cart_id || 0, {
        shop_id: member?.shop_id,
        user_cart_uuid: member?.uuid,
        currency_id: currency?.id,
      }),
    {
      onSuccess: (data) => dispatch(updateUserCart(data.data)),
      onError: () => {
        dispatch(clearUserCart());
        clearMember();
        warning(t("you.kicked.from.group"), {
          toastId: "group_order_finished",
        });
      },
      enabled: !!member?.cart_id,
      retry: false,
      refetchInterval: 5000,
      refetchOnWindowFocus: true,
      staleTime: 0,
    }
  );

  return (
    <div className={cls.wrapper}>
      <div className={cls.body}>
        {cart?.user_carts?.map((item: UserCart) => (
          <React.Fragment key={"user" + item.id}>
            <MemberCartHeader data={item} cart={cart} />
            {item.cartDetails.map((el) => (
              <MemberCartProduct
                key={"c" + el.id + "q" + el.quantity}
                data={el}
                cartId={item.cart_id || 0}
                disabled={item.uuid !== member?.uuid}
              />
            ))}
          </React.Fragment>
        ))}
        {isEmpty && !isLoading && (
          <div className={cls.empty}>
            <EmptyCart />
          </div>
        )}
      </div>
      {!isEmpty && <CartServices data={shop} />}
      {!isEmpty && (
        <MemberCartTotal totalPrice={cart.total_price} data={shop} />
      )}
      {isLoading && <Loading />}
    </div>
  );
}
