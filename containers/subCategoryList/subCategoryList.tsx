import { Category } from "interfaces";
import React from "react";
import cls from "./subCategoryList.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  subCategories?: Category[];
};

export default function SubCategoryList({ subCategories }: Props) {
  const { query } = useRouter();
  return (
    <div className={`${cls.list}`}>
      {subCategories?.map((category) => (
        <Link
          className={`${cls.link} ${query?.sub_category_id === category.id.toString()}`}
          shallow
          href={{ query: { sub_category_id: category.id, id: query?.id, category_id: query?.category_id } }}
          key={category.id}
        >
          {category.translation?.title}
        </Link>
      ))}
    </div>
  );
}
