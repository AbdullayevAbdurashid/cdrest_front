import React from "react";
import cls from "./recipeContainer.module.scss";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import { IRecipe } from "interfaces/recipe.interface";
import RecipeIngredients from "components/recipeIngredients/recipeIngredients";
import { RecipeProvider } from "contexts/recipe/recipe.provider";

type Props = {
  data?: IRecipe;
  children: any;
};

export default function RecipeContainer({ data, children }: Props) {
  return (
    <RecipeProvider data={data}>
      <div className={cls.root}>
        <div className={cls.container}>
          <div className="container">
            <div className={cls.header}>
              <ShopLogoBackground data={data?.shop} />
              <div className={cls.shop}>
                <h1 className={cls.title}>{data?.shop?.translation?.title}</h1>
                <p className={cls.text}>
                  {data?.shop?.translation?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <section className={cls.wrapper}>
            <main className={cls.body}>
              {React.Children.map(children, (child) => {
                return (
                  <div className={cls.itemWrapper}>
                    {React.cloneElement(child, { data })}
                  </div>
                );
              })}
            </main>
            <aside className={cls.aside}>
              <div className={cls.itemWrapper}>
                <RecipeIngredients data={data} />
              </div>
            </aside>
          </section>
        </div>
      </div>
    </RecipeProvider>
  );
}
