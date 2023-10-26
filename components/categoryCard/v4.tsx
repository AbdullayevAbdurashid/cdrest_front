import { Category } from "interfaces";
import React from "react";
import cls from "./v4.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  data: Category;
  parent?: string;
};

export default function CategoryCard({ data, parent }: Props) {
  const { query } = useRouter();
  return (
    <Link
      href={{
        pathname: !!parent
          ? `/shop-category/${parent}`
          : `/shop-category/${data.uuid}`,
        query: !!parent ? { sub: data.id } : undefined,
      }}
      shallow={!!parent}
      replace={!!parent}
    >
      <div
        className={`${cls.card} ${
          Number(query?.sub) === data.id ? cls.active : ""
        }`}
      >
        <Image
          width={30}
          height={30}
          className={cls.img}
          alt={data.translation.title}
          src={data.img || ""}
        />
        <span className={cls.text}>{data.translation?.title}</span>
      </div>
    </Link>
  );
}
