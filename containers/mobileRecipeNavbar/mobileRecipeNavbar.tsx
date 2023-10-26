import React from "react";
import { Category } from "interfaces";
import cls from "./mobileRecipeNavbar.module.scss";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import useModal from "hooks/useModal";
import { useRouter } from "next/router";
import Link from "next/link";

const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));

type Props = {
  categories: Category[];
};

export default function MobileRecipeNavbar({ categories = [] }: Props) {
  const { t } = useTranslation();
  const { query } = useRouter();
  const categoryId = Number(query.category_id);
  const [visible, handleOpenCategories, handleCloseCategories] = useModal();

  return (
    <div className={cls.container}>
      <div className={cls.wrapper}>
        <button className={cls.showAllBtn} onClick={handleOpenCategories}>
          <span className={cls.text}>
            {categoryId
              ? categories.find((item) => item.id === categoryId)?.translation
                  ?.title
              : t("all")}
          </span>
          <ArrowDownSLineIcon />
        </button>
      </div>

      <MobileDrawer open={visible} onClose={handleCloseCategories}>
        <div className={cls.drawerWrapper}>
          <Link
            href="/recipes"
            shallow={true}
            replace={true}
            className={`${cls.item} ${categoryId ? "" : cls.active}`}
            onClick={handleCloseCategories}
          >
            <span className={cls.text}>{t("all")}</span>
          </Link>
          {categories.map((item) => (
            <Link
              href={`/recipes?category_id=${item.id}`}
              shallow={true}
              replace={true}
              key={item.id}
              className={`${cls.item} ${
                item.id === categoryId ? cls.active : ""
              }`}
              onClick={handleCloseCategories}
            >
              <span className={cls.text}>{item.translation?.title}</span>
            </Link>
          ))}
        </div>
      </MobileDrawer>
    </div>
  );
}
