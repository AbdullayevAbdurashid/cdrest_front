import { useState } from "react";
import { ShopContext } from "./shop.context";
import { removeCookie, setCookie } from "utils/session";
import { IShop } from "interfaces";
import useShopWorkingSchedule from "hooks/useShopWorkingSchedule";

export type Member = {
  uuid: string;
  cart_id: number;
  shop_id: number;
};

type Props = {
  children: any;
  memberState: Member;
  data?: IShop;
};

export function ShopProvider({ children, memberState, data }: Props) {
  const [member, setMember] = useState<Member | undefined>(memberState);

  const { workingSchedule, isShopClosed, isOpen } =
    useShopWorkingSchedule(data);

  function setMemberData(data: Member) {
    setCookie("member", JSON.stringify(data));
    setMember(data);
  }

  function clearMember() {
    removeCookie("member");
    setMember(undefined);
  }

  return (
    <ShopContext.Provider
      value={{
        isMember: Boolean(member),
        member,
        setMemberData,
        clearMember,
        workingSchedule,
        isShopClosed,
        isOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
