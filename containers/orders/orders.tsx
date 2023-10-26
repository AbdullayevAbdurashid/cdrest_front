import React from "react";
import cls from "./orders.module.scss";
import dynamic from "next/dynamic";

const OrdersRefundButton = dynamic(
  () => import("components/ordersRefundButton/ordersRefundButton")
);
const WalletTopupButton = dynamic(
  () => import("components/ordersRefundButton/walletTopupButton")
);

type Props = {
  title: string;
  children: any;
  refund?: boolean;
  wallet?: boolean;
  handleWalletClick?: () => void;
};

export default function OrdersContainer({
  title,
  children,
  refund,
  wallet,
  handleWalletClick = () => {},
}: Props) {
  return (
    <section className={cls.root}>
      <div className="container">
        <div className={cls.wrapper}>
          <h1 className={cls.title}>{title}</h1>
          <div className={cls.main}>{children}</div>
          {refund && <OrdersRefundButton />}
          {wallet && <WalletTopupButton handleClick={handleWalletClick} />}
        </div>
      </div>
    </section>
  );
}
