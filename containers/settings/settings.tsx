import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import cls from "./settings.module.scss";
import { useRouter } from "next/router";
import Loading from "components/loader/loading";

type Props = {
  children: any;
  loading?: boolean;
};

export default function SettingsContainer({ children, loading }: Props) {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <section className={cls.root}>
      <div className="container">
        <div className={cls.wrapper}>
          <div className={cls.header}>
            <h1 className={cls.title}>{t("settings")}</h1>
            <div className={cls.navigation}>
              <Link
                href={"/setting/payment"}
                className={`${cls.item} ${
                  pathname.includes("payment") ? cls.active : ""
                } ${cls.disabled}`}
              >
                {t("payment")}
              </Link>
              <Link
                href={"/settings/notification"}
                className={`${cls.item} ${
                  pathname.includes("notification") ? cls.active : ""
                }`}
              >
                {t("notification")}
              </Link>
            </div>
          </div>
          <main className={cls.main}>{!loading ? children : <Loading />}</main>
        </div>
      </div>
    </section>
  );
}
