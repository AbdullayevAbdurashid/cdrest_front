import React from "react";
import { useTranslation } from "react-i18next";
import FlashlightFillIcon from "remixicon-react/FlashlightFillIcon";
import cls from "./popularBadge.module.scss";

type Props = {};

export default function PopularBadge({}: Props) {
  const { t } = useTranslation();

  return (
    <div className={cls.badge}>
      <FlashlightFillIcon />
      <span className={cls.text}>{t("popular")}</span>
    </div>
  );
}
