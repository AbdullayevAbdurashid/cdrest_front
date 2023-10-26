import React from "react";
import cls from "./searchResultItem.module.scss";
import { Product } from "interfaces";
import Link from "next/link";
import Price from "components/price/price";
import getImage from "utils/getImage";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data: Product;
  onClickItem?: () => void;
};

export default function ProductResultItem({ data, onClickItem }: Props) {
  return (
    <div className={cls.row}>
      <Link
        href={`/shop/${data.shop?.id}?product=${data.uuid}`}
        shallow={true}
        className={cls.flex}
        onClick={onClickItem}
      >
        <div className={cls.imgWrapper}>
          <FallbackImage
            fill
            src={getImage(data.img)}
            alt={data.translation?.title}
            sizes="320px"
            quality={90}
          />
        </div>
        <div className={cls.naming}>
          <h4 className={cls.shopTitle}>{data.translation?.title}</h4>
          <p className={cls.desc}>{data.translation?.description}</p>
          <div className={cls.price}>
            <Price number={data.stocks?.length ? data.stocks[0]?.price : 0} />
          </div>
        </div>
      </Link>
    </div>
  );
}
