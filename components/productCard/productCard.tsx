import React from "react";
import Link from "next/link";
import cls from "./productCard.module.scss";
import { Product } from "interfaces";
import getImage from "utils/getImage";
import Price from "components/price/price";
import Badge from "components/badge/badge";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { useRouter } from "next/router";

type Props = {
  data: Product;
  handleOpen: (event: any, data: Product) => void;
};

export default function ProductCard({ data, handleOpen }: Props) {
  const { query } = useRouter();

  const params: Record<string, string | undefined> = {
    product: data.uuid,
  };

  if (query?.category_id) {
    params.category_id = query?.category_id as string;
  }

  if (query?.sub_category_id) {
    params.sub_category_id = query?.sub_category_id as string;
  }

  const oldPrice = data.stock?.tax
    ? data.stock?.price + data.stock?.tax
    : data.stock?.price;

  return (
    <Link
      href={{
        pathname: `/shop/${data.shop_id}`,
        query: params,
      }}
      shallow={true}
      replace={true}
      className={`${cls.wrapper} ${data.id === 0 ? cls.active : ""}`}
    >
      <div className={cls.header}>
        <FallbackImage
          fill
          src={getImage(data.img)}
          alt={data.translation?.title}
          sizes="320px"
          quality={90}
        />
      </div>
      <div className={cls.body}>
        <h3 className={cls.title}>{data.translation?.title}</h3>
        <p className={cls.text}>{data.translation?.description}</p>
        <span className={cls.price}>
          <Price number={data.stock?.total_price} />
        </span>{" "}
        {!!data.stock?.discount && (
          <span className={cls.oldPrice}>
            <Price number={oldPrice} old />
          </span>
        )}
        <span className={cls.bonus}>
          {data.stock?.bonus && <Badge type="bonus" variant="circle" />}
        </span>
      </div>
    </Link>
  );
}
