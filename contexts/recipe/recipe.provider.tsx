import { useReducer } from "react";
import { RecipeContext } from "./recipe.context";
import { IRecipe, RecipeStock } from "interfaces/recipe.interface";

enum RecipeActionKind {
  REDUCE_QUANTITY = "REDUCE_QUANTITY",
  ADD_QUANTITY = "ADD_QUANTITY",
}
interface RecipeAction {
  type: RecipeActionKind;
  payload: number;
}
interface StateType {
  stocks: RecipeStock[];
}

function reducer(state: StateType, action: RecipeAction) {
  const { type, payload } = action;
  switch (type) {
    case RecipeActionKind.ADD_QUANTITY:
      return {
        stocks: state.stocks.map((item) => {
          if (item.id === payload) {
            if (item.qty === 0) {
              return {
                ...item,
                qty: item.qty + item.min_quantity,
              };
            } else {
              return {
                ...item,
                qty: item.qty + 1,
              };
            }
          } else {
            return item;
          }
        }),
      };
    case RecipeActionKind.REDUCE_QUANTITY:
      return {
        stocks: state.stocks.map((item) => {
          if (item.id === payload) {
            if (item.min_quantity === item.qty) {
              return {
                ...item,
                qty: item.qty - item.min_quantity,
              };
            } else {
              return {
                ...item,
                qty: item.qty - 1,
              };
            }
          } else {
            return item;
          }
        }),
      };
    default:
      return state;
  }
}

type Props = {
  children: any;
  data?: IRecipe;
};

export function RecipeProvider({ children, data }: Props) {
  const [state, dispatch] = useReducer(reducer, {
    stocks: data?.stocks?.length
      ? data?.stocks?.map((item) => ({ ...item, qty: item.min_quantity }))
      : [],
  });

  function addRecipeStock(stock_id: number) {
    dispatch({ type: RecipeActionKind.ADD_QUANTITY, payload: stock_id });
  }

  function reduceRecipeStock(stock_id: number) {
    dispatch({ type: RecipeActionKind.REDUCE_QUANTITY, payload: stock_id });
  }

  return (
    <RecipeContext.Provider
      value={{
        recipeStocks: state.stocks,
        addRecipeStock,
        reduceRecipeStock,
        addableRecipeStocks: state.stocks.filter((item) => !!item.qty),
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
