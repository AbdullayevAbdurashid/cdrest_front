import React from "react";
import cls from "./recipeContent.module.scss";
import { IRecipe } from "interfaces/recipe.interface";
import { useTranslation } from "react-i18next";

type Props = { data?: IRecipe };

export default function RecipeContent({ data }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cls.wrapper}>
      <div className={cls.block}>
        <div className={cls.header}>
          <h2>{t("ingredients")}</h2>
        </div>
        <div
          className={cls.content}
          dangerouslySetInnerHTML={{ __html: data?.ingredient?.title || "" }}
        />
      </div>
      <div className={cls.block}>
        <div className={cls.header}>
          <h2>{t("instructions")}</h2>
        </div>
        <div
          className={cls.content}
          dangerouslySetInnerHTML={{ __html: data?.instruction?.title || "" }}
        />
      </div>
      <div className={cls.block}>
        <div className={cls.header}>
          <h2>{t("nutritions")}</h2>
        </div>
        {data?.nutritions?.map((item) => (
          <div key={item.id} className={cls.row}>
            <p className={cls.title}>{item.translation?.title}</p>
            <p className={cls.text}>{item.weight}</p>
            <p className={cls.text}>{item.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
