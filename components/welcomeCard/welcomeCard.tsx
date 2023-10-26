/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./welcomeCard.module.scss";
import useLocale from "hooks/useLocale";
import { BrandLogoRounded } from "components/icons";
import { useSettings } from "contexts/settings/settings.context";

type Props = {};

export default function WelcomeCard({}: Props) {
  const { t } = useLocale();
  const { settings } = useSettings();

  return (
    <div className="container">
      <div className={cls.wrapper}>
        <div className={cls.flex}>
          <BrandLogoRounded />
          <h3 className={cls.title}>{t("app.text")}</h3>
        </div>
        <div className={cls.actions}>
          <a
            href={settings?.customer_app_ios}
            className={cls.item}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={cls.imgWrapper}>
              <img src="/images/app-store.webp" alt="App store" />
            </span>
          </a>
          <a
            href={settings?.customer_app_android}
            className={cls.item}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={cls.imgWrapper}>
              <img src="/images/google-play.webp" alt="Google play" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
