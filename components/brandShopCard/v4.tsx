import { IShop } from "interfaces";
import React from "react";
import cls from "./v4.module.scss";
import Image from "next/image";
import Link from "next/link";
import VerifiedComponent from "components/verifiedComponent/verifiedComponent";

type Props = {
  data: IShop;
};

export default function BrandShopCard({ data }: Props) {
  return (
    <Link href={`/shop/${data.id}`}>
      <div className={cls.card}>
        <Image
          className={cls.img}
          alt={data.translation?.title}
          src={data.logo_img || ""}
          width={100}
          height={100}
        />
        <div className={cls.content}>
          <div className={cls.titleVerify}>
            <strong className={cls.title}>{data.translation?.title}</strong>
            {data?.verify === 1 && <VerifiedComponent />}
          </div>
          <span className={cls.deliveryTime}>
            {data.delivery_time?.from} - {data.delivery_time?.to}{" "}
            {data.delivery_time?.type}
          </span>
        </div>
      </div>
    </Link>
  );
}
