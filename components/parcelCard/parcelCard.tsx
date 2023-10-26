import React from "react";
import cls from "./parcelCard.module.scss";
import Link from "next/link";
import useLocale from "hooks/useLocale";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {};

export default function ParcelCard({}: Props) {
  const { t } = useLocale();

  return (
    <Link href="/parcel-checkout" className={cls.story}>
      <div className={cls.wrapper}>
        <span className={cls.title}>{t("door.to.door.delivery")}</span>
        <FallbackImage src="/images/parcel.jpeg" alt="Parcel" />
      </div>
    </Link>
  );
}
