import React from "react";
import cls from "./recipeList.module.scss";
import { Grid, Skeleton, useMediaQuery } from "@mui/material";
import { IRecipe } from "interfaces/recipe.interface";
import RecipeCard from "components/recipeCard/recipeCard";

type Props = {
  data: IRecipe[];
  loading?: boolean;
};

export default function RecipeList({ data, loading }: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <section
      className="container"
      style={{
        display: !loading && data.length === 0 ? "none" : "block",
      }}
    >
      <div className={cls.container}>
        <Grid container spacing={isDesktop ? 4 : 2}>
          {!loading
            ? data.map((item) => (
                <Grid key={item.id} item xs={12} sm={4} lg={2.4}>
                  <RecipeCard data={item} />
                </Grid>
              ))
            : Array.from(new Array(5)).map((item, idx) => (
                <Grid key={"recipe" + idx} item xs={12} sm={4} lg={2.4}>
                  <Skeleton variant="rectangular" className={cls.shimmer} />
                </Grid>
              ))}
        </Grid>
      </div>
    </section>
  );
}
