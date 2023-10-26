import React from "react";
import cls from "./ordersRefundButton.module.scss";
import Price from "components/price/price";
import { useAuth } from "contexts/auth/auth.context";
import { useTranslation } from "react-i18next";
import AddCircleLineIcon from "remixicon-react/AddCircleLineIcon";

type Props = {
  handleClick: () => void;
};

export default function WalletTopupButton({ handleClick }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className={cls.root}>
      <button className={cls.textBtn} onClick={() => {}}>
        <AddCircleLineIcon />
        <span className={cls.text}>{t("wallet")}:</span>
        <span className={cls.bold}>
          <Price number={user?.wallet?.price} />
        </span>
      </button>
    </div>
  );
}
