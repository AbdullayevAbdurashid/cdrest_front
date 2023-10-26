import React from "react";
import cls from "./v4.module.scss";
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
  type ="bonus",
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
          <span className={cls.text}>{t("bonus")}</span>
          <div className={cls.icon}>
            <Gift2FillIcon />
          </div>
        </span>
      );
    case "discount":
      return (
        <span
          className={`${cls.badge} ${cls.discount} ${cls[variant]} ${cls[size]}`}
        >
          <span className={cls.text}>{t("discount")}</span>
          <div className={cls.icon}>
            <PercentFillIcon />
          </div>
        </span>
      );
    case "popular":
      return (
        <span
          className={`${cls.badge} ${cls.popular} ${cls[variant]} ${cls[size]}`}
        >
          <span className={cls.text}>{t("popular")}</span>
          <div className={cls.icon}>
            <FlashlightFillIcon />
          </div>
        </span>
      );

    default:
      return <span></span>;
  }
}
