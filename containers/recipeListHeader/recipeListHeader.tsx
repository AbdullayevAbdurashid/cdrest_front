import React from "react";
import cls from "./recipeListHeader.module.scss";
import { useTranslation } from "react-i18next";
import { Category } from "interfaces";
import { useMediaQuery } from "@mui/material";
import RecipeNavbar from "containers/recipeNavbar/recipeNavbar";
import MobileRecipeNavbar from "containers/mobileRecipeNavbar/mobileRecipeNavbar";

type Props = {
  categories?: Category[];
};

export default function RecipeListHeader({ categories = [] }: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.header}>
          <h1 className={cls.title}>{t("recipes.title")}</h1>
          <p className={cls.text}>{t("recipes.description")}</p>
        </div>
        {isDesktop ? (
          <RecipeNavbar categories={categories} />
        ) : (
          <MobileRecipeNavbar categories={categories} />
        )}
      </div>
    </div>
  );
}
