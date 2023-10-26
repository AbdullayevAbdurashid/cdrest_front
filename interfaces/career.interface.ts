import { Category, IShopTranslation } from "interfaces";

export interface ICareer {
  id: number;
  category_id: number;
  location: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  translation?: IShopTranslation;
}
