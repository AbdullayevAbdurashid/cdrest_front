import React from "react";
import cls from "./orderList.module.scss";
import { Refund } from "interfaces";
import { Skeleton } from "@mui/material";
import RefundListItem from "components/refundListItem/refundListItem";
import Empty from "components/empty/empty";
import { useTranslation } from "react-i18next";

type Props = {
  data: Refund[];
  loading?: boolean;
};

export default function RefundList({ data = [], loading = false }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cls.root}>
      {!loading
        ? data.map((item) => (
            <RefundListItem
              key={item.id}
              data={item}
              active={item.status === "pending"}
            />
          ))
        : Array.from(new Array(3)).map((item, idx) => (
            <Skeleton
              key={"shops" + idx}
              variant="rectangular"
              className={cls.shimmer}
            />
          ))}
      {!loading && !data.length && <Empty text={t("no.refunds.found")} />}
    </div>
  );
}
