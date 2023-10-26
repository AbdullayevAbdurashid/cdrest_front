import React from "react";
import cls from "./zoneNotFound.module.scss";
import { useTranslation } from "react-i18next";

type Props = {};

export default function ZoneNotFound({}: Props) {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className={cls.wrapper}>
        <h3 className={cls.title}>{t("no.zone.title")}</h3>
        <p className={cls.text}>{t("no.zone.text")}</p>
      </div>
    </div>
  );
}
