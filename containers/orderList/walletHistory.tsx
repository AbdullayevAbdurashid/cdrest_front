import React from "react";
import cls from "./orderList.module.scss";
import { IWallet } from "interfaces";
import { Skeleton } from "@mui/material";
import WalletHistoryItem from "components/walletHistoryItem/walletHistoryItem";
import Empty from "components/empty/empty";
import { useTranslation } from "react-i18next";

type Props = {
  data: IWallet[];
  loading?: boolean;
};

export default function WalletHistory({ data = [], loading = false }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cls.root}>
      {!loading
        ? data.map((item, idx) => (
            <WalletHistoryItem key={item.id} data={item} dataIdx={idx + 1} />
          ))
        : Array.from(new Array(3)).map((item, idx) => (
            <Skeleton
              key={"shops" + idx}
              variant="rectangular"
              className={cls.shimmer}
            />
          ))}
      {!loading && !data.length && <Empty text={t("no.wallet.found")} />}
    </div>
  );
}
