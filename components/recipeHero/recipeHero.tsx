import React from "react";
import cls from "./recipeHero.module.scss";
import { IRecipe } from "interfaces/recipe.interface";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { useTranslation } from "react-i18next";

type Props = { data?: IRecipe };

export default function RecipeHero({ data }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{data?.translation?.title}</h2>
      <div className={cls.hero}>
        <div className={cls.heroWrapper}>
          <FallbackImage src={data?.bg_img} alt={data?.translation?.title} />
        </div>
        <div className={cls.card}>
          <div className={cls.cardWrapper}>
            <div className={cls.item}>
              <label className={cls.label}>{t("active.time")}</label>
              <p className={cls.value}>{data?.active_time}</p>
            </div>
            <div className={cls.item}>
              <label className={cls.label}>{t("total.time")}</label>
              <p className={cls.value}>{data?.total_time}</p>
            </div>
            <div className={cls.item}>
              <label className={cls.label}>{t("calories")}</label>
              <p className={cls.value}>{data?.calories}</p>
            </div>
            <div className={cls.item}>
              <label className={cls.label}>{t("servings")}</label>
              <p className={cls.value}>{data?.servings}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
