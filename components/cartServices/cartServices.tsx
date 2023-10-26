import React from "react";
import RunFillIcon from "remixicon-react/RunFillIcon";
import cls from "./cartServices.module.scss";
import { useTranslation } from "react-i18next";
import { IShop } from "interfaces";
import Price from "components/price/price";
import { selectCurrency } from "redux/slices/currency";
import { useAppSelector } from "hooks/useRedux";
import { selectUserCart } from "redux/slices/userCart";
import Badge from "components/badge/badge";

type Props = {
  data: IShop;
};

export default function CartServices({ data }: Props) {
  const { t } = useTranslation();
  const currency = useAppSelector(selectCurrency);
  const cart = useAppSelector(selectUserCart);

  return (
    <div className={cls.wrapper}>
      <div className={cls.flex}>
        <div className={cls.item}>
          <div className={cls.icon}>
            <span className={cls.greenDot} />
            <RunFillIcon />
          </div>
          <div className={cls.row}>
            <h5 className={cls.title}>{t("delivery.price")}</h5>
            <p className={cls.text}>{t("start.price")}</p>
          </div>
        </div>
        <div className={cls.price}>
          <Price number={data?.price * Number(currency?.rate)} />
        </div>
      </div>

      {!!cart.receipt_discount && (
        <div className={cls.flex}>
          <div className={cls.item}>
            <Badge type="discount" variant="circle" />
            <span></span>
            <div className={cls.row}>
              <h5 className={cls.title}>{t("discount")}</h5>
              <p className={cls.text}>{t("recipe.discount.definition")}</p>
            </div>
          </div>
          <div className={cls.price}>
            <Price number={cart.receipt_discount} minus />
          </div>
        </div>
      )}
    </div>
  );
}
