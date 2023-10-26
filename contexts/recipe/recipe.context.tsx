import { RecipeStock } from "interfaces/recipe.interface";
import { createContext, useContext } from "react";

type RecipeContextType = {
  recipeStocks: RecipeStock[];
  addRecipeStock: (stock_id: number) => void;
  reduceRecipeStock: (stock_id: number) => void;
  addableRecipeStocks: RecipeStock[];
};

export const RecipeContext = createContext<RecipeContextType>(
  {} as RecipeContextType
);

export const useRecipe = () => useContext(RecipeContext);
