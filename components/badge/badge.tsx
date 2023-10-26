import React from "react";
import cls from "./badge.module.scss";
import { useTranslation } from "react-i18next";
import Gift2FillIcon from "remixicon-react/Gift2FillIcon";
import PercentFillIcon from "remixicon-react/PercentFillIcon";
import FlashlightFillIcon from "remixicon-react/FlashlightFillIcon";

type Props = {
  type: "bonus" | "discount" | "popular";
  variant?: "default" | "circle";
  size?: "medium" | "large";
};

export default function Badge({
  type,
  variant = "default",
  size = "medium",
}: Props) {
  const { t } = useTranslation();

  switch (type) {
    case "bonus":
      return (
        <span
          className={`${cls.badge} ${cls.bonus} ${cls[variant]} ${cls[size]}`}
        >
          <Gift2FillIcon />
          <span className={cls.text}>{t("bonus")}</span>
        </span>
      );
    case "discount":
      return (
        <span
          className={`${cls.badge} ${cls.discount} ${cls[variant]} ${cls[size]}`}
        >
          <PercentFillIcon />
          <span className={cls.text}>{t("discount")}</span>
        </span>
      );
    case "popular":
      return (
        <span
          className={`${cls.badge} ${cls.popular} ${cls[variant]} ${cls[size]}`}
        >
          <FlashlightFillIcon />
          <span className={cls.text}>{t("popular")}</span>
        </span>
      );

    default:
      return <span></span>;
  }
}
