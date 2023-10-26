import React from "react";
import cls from "./shopCategoryHeader.module.scss";
import useLocale from "hooks/useLocale";
import Link from "next/link";
import { Category } from "interfaces";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";

type Props = { data?: Category };

export default function ShopCategoryHeader({ data }: Props) {
  const { t } = useLocale();

  return (
    <div className="container">
      <div className={cls.wrapper}>
        <ul className={cls.breadcrumbs}>
          <li className={cls.item}>
            <Link href="/" className={cls.link}>
              {t("home.page")}
            </Link>
          </li>
          <li className={cls.item}>
            <span className={cls.icon}>
              <ArrowRightSLineIcon />
            </span>
          </li>
          <li className={cls.item}>
            <span className={cls.text}>{data?.translation?.title}</span>
          </li>
        </ul>
        <h1 className={cls.title}>{data?.translation?.title}</h1>
      </div>
    </div>
  );
}
