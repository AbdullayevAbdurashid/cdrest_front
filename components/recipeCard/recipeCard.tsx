import React from "react";
import cls from "./recipeCard.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import getImage from "utils/getImage";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { IRecipe } from "interfaces/recipe.interface";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import RestaurantFillIcon from "remixicon-react/RestaurantFillIcon";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";

type Props = {
  data: IRecipe;
};

export default function RecipeCard({ data }: Props) {
  const { t } = useTranslation();
  const currency = useAppSelector(selectCurrency);

  return (
    <Link
      href={`/recipes/${data.id}?currency_id=${currency?.id}`}
      className={cls.wrapper}
    >
      <div className={cls.header}>
        <FallbackImage
          fill
          src={getImage(data.img)}
          alt={data.translation?.title}
          sizes="400px"
        />
      </div>
      <div className={cls.body}>
        <h3 className={cls.title}>{data.translation?.title}</h3>
        <p className={cls.text}>{data.translation?.description}</p>
      </div>
      <div className={cls.footer}>
        <div className={cls.flex}>
          <TimeFillIcon />
          <span className={cls.text}>
            {data.total_time} {t("min")}
          </span>
        </div>
        <span className={cls.dot} />
        <div className={cls.flex}>
          <RestaurantFillIcon />
          <span className={cls.text}>
            {data.calories} {t("kkl")}
          </span>
        </div>
      </div>
      <div className={cls.footer}>
        <div className={cls.flex}>
          <ShopLogoBackground data={data.shop} size="small" />
          <h5 className={cls.text}>{data.shop?.translation?.title}</h5>
        </div>
      </div>
    </Link>
  );
}
