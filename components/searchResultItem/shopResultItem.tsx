import React from "react";
import cls from "./searchResultItem.module.scss";
import { IShop } from "interfaces";
import Link from "next/link";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";

type Props = {
  data: IShop;
  onClickItem?: () => void;
};

export default function ShopResultItem({ data, onClickItem }: Props) {
  return (
    <div className={cls.row}>
      <Link
        href={`/shop/${data.id}`}
        className={cls.flex}
        onClick={onClickItem}
      >
        <ShopLogoBackground data={data} />
        <div className={cls.naming}>
          <h4 className={cls.shopTitle}>{data.translation?.title}</h4>
          <p className={cls.desc}>{data.translation?.description}</p>
        </div>
      </Link>
    </div>
  );
}
