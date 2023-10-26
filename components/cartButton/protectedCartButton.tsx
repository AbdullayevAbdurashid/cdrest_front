import React from "react";
import cls from "./cartButton.module.scss";
import Link from "next/link";
import ShoppingBag3LineIcon from "remixicon-react/ShoppingBag3LineIcon";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import {
  clearUserCart,
  selectUserCart,
  updateUserCart,
} from "redux/slices/userCart";
import { useQuery } from "react-query";
import cartService from "services/cart";
import Price from "components/price/price";
import { selectCurrency } from "redux/slices/currency";

type Props = {};

export default function ProtectedCartButton({}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectUserCart);
  const cartItems = cart?.user_carts.flatMap((item) => item.cartDetails) || [];
  const currency = useAppSelector(selectCurrency);

  useQuery(
    ["cart", currency?.id],
    () => cartService.get({ currency_id: currency?.id }),
    {
      onSuccess: (data) => dispatch(updateUserCart(data.data)),
      onError: () => dispatch(clearUserCart()),
      retry: false,
    }
  );

  if (cartItems.length) {
    return (
      <div className={cls.cartBtnWrapper}>
        <Link href={`/restaurant/${cart.shop_id}`} className={cls.cartBtn}>
          <ShoppingBag3LineIcon />
          <div className={cls.text}>
            <span>{t("order")}</span>{" "}
            <span className={cls.price}>
              <Price number={cart.total_price} />
            </span>
          </div>
        </Link>
      </div>
    );
  } else {
    return <div></div>;
  }
}
