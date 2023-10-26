import React from "react";
import cls from "./v2.module.scss";
import useLocale from "hooks/useLocale";
import FallbackImage from "components/fallbackImage/fallbackImage";
import SecondaryButton from "components/button/secondaryButton";
import { useRouter } from "next/router";

type Props = {};

export default function ParcelCard({}: Props) {
  const { t } = useLocale();
  const { push } = useRouter();

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.wrapper}>
          <div className={cls.body}>
            <h1 className={cls.title}>{t("door.to.door.delivery")}</h1>
            <p className={cls.caption}>{t("door.to.door.delivery.service")}</p>
          </div>
          <div className={cls.actions}>
            <SecondaryButton onClick={() => push("/parcel-checkout")}>
              {t("learn.more")}
            </SecondaryButton>
          </div>
          <div className={cls.imgWrapper}>
            <FallbackImage src="/images/parcel-2.png" alt="Parcel" />
          </div>
        </div>
      </div>
    </div>
  );
}
