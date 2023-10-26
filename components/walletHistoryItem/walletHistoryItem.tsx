import React from "react";
import { IWallet } from "interfaces";
import cls from "./walletHistoryItem.module.scss";
import { useTranslation } from "react-i18next";
import Price from "components/price/price";
import dayjs from "dayjs";
import { Grid } from "@mui/material";

type Props = {
  data: IWallet;
  dataIdx: number;
};

export default function WalletHistoryItem({ data, dataIdx }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cls.wrapper}>
      <Grid container spacing={4} alignItems="center">
        <Grid item sm={4} md={3} lg={2}>
          <div className={cls.item}>
            <div className={cls.badge}>{dataIdx}</div>
            <div className={cls.naming}>
              <h3 className={cls.title}>#{data.transaction_id}</h3>
              <p className={cls.text}>{t("transaction.id")}</p>
            </div>
          </div>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          <h3 className={cls.title}>
            {data.author.firstname} {data.author.lastname}
          </h3>
          <p className={cls.text}>{t("sender")}</p>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          <h3 className={cls.title}>
            <Price number={data.price} />
          </h3>
          <p className={cls.text}>{t("price")}</p>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          <h3 className={cls.title}>
            {dayjs(data.updated_at).format("DD.MM.YY — HH:mm")}
          </h3>
          <p className={cls.text}>{t("date")}</p>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          <h3 className={cls.title}>{data.note}</h3>
          <p className={cls.text}>{t("note")}</p>
        </Grid>
      </Grid>
    </div>
  );
}
