/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./emptyCart.module.scss";
import { useTranslation } from "react-i18next";

type Props = {};

export default function EmptyCart({}: Props) {
  const { t } = useTranslation();

  return (
    <div className={cls.root}>
      <img
        src="/images/empty-cart.jpeg"
        alt="Empty cart"
        className={cls.image}
      />
      <p className={cls.text}>{t("cart.empty")}</p>
    </div>
  );
}
