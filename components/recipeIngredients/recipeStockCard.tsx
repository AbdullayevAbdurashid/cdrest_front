import React from "react";
import cls from "./recipeIngredients.module.scss";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import AddFillIcon from "remixicon-react/AddFillIcon";
import Price from "components/price/price";
import FallbackImage from "components/fallbackImage/fallbackImage";
import getImage from "utils/getImage";
import { RecipeStock } from "interfaces/recipe.interface";
import { useRecipe } from "contexts/recipe/recipe.context";

type Props = {
  data: RecipeStock;
  quantity: number;
};

export default function RecipeStockCard({ data, quantity = 0 }: Props) {
  const totalPrice = Number(data.total_price) * quantity || 0;
  const isReduceDisabled = quantity <= 0;
  const isAddDisabled = !(data.quantity > quantity);
  const { addRecipeStock, reduceRecipeStock } = useRecipe();

  return (
    <div className={cls.row}>
      <div className={cls.col}>
        <h4 className={cls.title}>{data.product?.translation.title}</h4>
        <p className={cls.desc}>{data.product?.translation?.description}</p>
        <div className={cls.actions}>
          <div className={cls.counter}>
            <button
              type="button"
              className={`${cls.counterBtn} ${
                isReduceDisabled ? cls.disabled : ""
              }`}
              disabled={isReduceDisabled}
              onClick={() => reduceRecipeStock(data.id)}
            >
              <SubtractFillIcon />
            </button>
            <div className={cls.count}>
              {quantity * (data.product?.interval || 1)}
              {data.product?.unit?.translation?.title}
            </div>

            <button
              type="button"
              className={`${cls.counterBtn} ${
                isAddDisabled ? cls.disabled : ""
              }`}
              disabled={isAddDisabled}
              onClick={() => addRecipeStock(data.id)}
            >
              <AddFillIcon />
            </button>
          </div>
          <div className={cls.price}>
            <Price number={totalPrice} />
          </div>
        </div>
      </div>
      <div className={cls.imageWrapper}>
        <FallbackImage
          fill
          src={getImage(data.product?.img)}
          alt={data.product?.translation.title}
          sizes="320px"
          quality={90}
        />
      </div>
    </div>
  );
}
