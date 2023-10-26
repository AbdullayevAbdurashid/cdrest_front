import React from "react";
import cls from "./cart.module.scss";
import CartHeader from "components/cartHeader/cartHeader";
import CartProduct from "components/cartProduct/cartProduct";
import CartServices from "components/cartServices/cartServices";
import CartTotal from "components/cartTotal/cartTotal";
import { useAppSelector } from "hooks/useRedux";
import { selectCart, selectTotalPrice } from "redux/slices/cart";
import EmptyCart from "components/emptyCart/emptyCart";
import { IShop } from "interfaces";

type Props = {
  shop: IShop;
};

export default function Cart({ shop }: Props) {
  const cartItems = useAppSelector(selectCart);
  const totalPrice = useAppSelector(selectTotalPrice);

  return (
    <div className={cls.wrapper}>
      <div className={cls.body}>
        <CartHeader />
        {cartItems.map((item) => (
          <CartProduct key={item.stock.id} data={item} />
        ))}
        {cartItems.length < 1 && (
          <div className={cls.empty}>
            <EmptyCart />
          </div>
        )}
      </div>
      {cartItems.length > 0 && <CartServices data={shop} />}
      {cartItems.length > 0 && (
        <CartTotal totalPrice={totalPrice} data={shop} />
      )}
    </div>
  );
}
