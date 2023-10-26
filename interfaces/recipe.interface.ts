import { CartStock, Category, IShop, Translation } from "interfaces";

export interface IRecipe {
  id: number;
  shop_id: number;
  category_id: number;
  active_time: string;
  total_time: string;
  calories: number;
  servings: number;
  discount_type: string;
  discount_price: number;
  img?: string;
  origin_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  shop?: IShop;
  category?: Category;
  translation?: Translation;
  ingredient?: Ingredient;
  instruction?: Instruction;
  nutritions?: Nutrition[];
  stocks?: RecipeStock[];
  bg_img?: string;
}

export interface Nutrition {
  id: number;
  locale: string;
  translation?: Translation;
  weight: string;
  percentage: number;
}

export interface Instruction {
  id: number;
  locale: string;
  title: string;
}

export interface Ingredient {
  id: number;
  locale: string;
  title: string;
}

export interface RecipeStock extends CartStock {
  min_quantity: number;
  qty: number;
}
