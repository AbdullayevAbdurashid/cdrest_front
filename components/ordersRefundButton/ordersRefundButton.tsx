import React from "react";
import Link from "next/link";
import cls from "./ordersRefundButton.module.scss";
import Refund2LineIcon from "remixicon-react/Refund2LineIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import useLocale from "hooks/useLocale";
import { useTheme } from "contexts/theme/theme.context";

type Props = {};

export default function OrdersRefundButton({}: Props) {
  const { t } = useLocale();
  const { direction } = useTheme();

  return (
    <div className={cls.root}>
      <Link href="/order-refunds" className={cls.textBtn}>
        <Refund2LineIcon />
        <span className={cls.text}>{t("refunds")}</span>
        {direction === "rtl" ? <ArrowLeftSLineIcon /> : <ArrowRightSLineIcon />}
      </Link>
    </div>
  );
}
