/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./unauthorized.module.scss";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/button/primaryButton";
import { useRouter } from "next/router";

type Props = {
  text: string;
};

export default function Unauthorized({ text }: Props) {
  const { t } = useTranslation();
  const { push } = useRouter();

  return (
    <div className={cls.wrapper}>
      <img src="/images/delivery.webp" alt="Unauthorized" />
      <p className={cls.text}>{text}</p>
      <div className={cls.actions}>
        <PrimaryButton onClick={() => push("/login")}>
          {t("login.or.create.account")}
        </PrimaryButton>
      </div>
    </div>
  );
}
