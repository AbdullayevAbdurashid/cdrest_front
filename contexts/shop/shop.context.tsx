import { createContext, useContext } from "react";
import { Member } from "./shop.provider";
import { ShopWorkingDays } from "interfaces";

type ShopContextType = {
  isMember: boolean;
  member?: Member;
  setMemberData: (data: Member) => void;
  clearMember: () => void;
  workingSchedule: ShopWorkingDays;
  isShopClosed: boolean;
  isOpen: boolean;
};

export const ShopContext = createContext<ShopContextType>(
  {} as ShopContextType
);

export const useShop = () => useContext(ShopContext);
