import { IShop } from "interfaces";
import { createContext, useContext } from "react";
import { ShopWorkingDays } from "interfaces";

type RestaurantContextType = {
  restaurant?: IShop;
  updateRestaurant: (data: IShop) => void;
  resetRestaurant: () => void;
  workingSchedule?: ShopWorkingDays;
  isShopClosed: boolean;
  isOpen: boolean;
};

export const RestaurantContext = createContext<RestaurantContextType>(
  {} as RestaurantContextType
);

export const useRestaurant = () => useContext(RestaurantContext);
