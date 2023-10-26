import React from "react";
import { Category } from "interfaces";
import cls from "./mobileShopCategories.module.scss";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  data: Category[];
  onClose: () => void;
};

export default function MobileProductCategories({ data, onClose }: Props) {
  const { t } = useTranslation();
  const { query } = useRouter();

  return (
    <div className={cls.wrapper}>
      <a href={`#popular`} className={`${cls.item}`} onClick={onClose}>
        <span className={cls.text}>{t("popular")}</span>
      </a>
      {data.map((item) => (
        <Link
          key={item.id}
          href={{ query: { id: query?.id, category_id: item.id } }}
          className={cls.item}
          onClick={onClose}
          shallow
        >
          <span className={cls.text}>{item.translation?.title}</span>
        </Link>
      ))}
    </div>
  );
}
