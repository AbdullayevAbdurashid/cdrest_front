import React from "react";
import cls from "./cartButton.module.scss";
import Link from "next/link";
import ShoppingBag3LineIcon from "remixicon-react/ShoppingBag3LineIcon";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks/useRedux";
import { selectCart, selectTotalPrice } from "redux/slices/cart";
import Price from "components/price/price";

type Props = {};

export default function CartButton({}: Props) {
  const { t } = useTranslation();
  const cart = useAppSelector(selectCart);
  const totalPrice = useAppSelector(selectTotalPrice);

  if (cart.length) {
    return (
      <div className={cls.cartBtnWrapper}>
        <Link href={`/restaurant/${cart[0].shop_id}`} className={cls.cartBtn}>
          <ShoppingBag3LineIcon />
          <div className={cls.text}>
            <span>{t("order")}</span>{" "}
            <span className={cls.price}>
              <Price number={totalPrice} />
            </span>
          </div>
        </Link>
      </div>
    );
  } else {
    return <div></div>;
  }
}
