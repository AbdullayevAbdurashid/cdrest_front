import React from "react";
import cls from "./shopContainer.module.scss";
import dynamic from "next/dynamic";
import { IShop } from "interfaces";
import { Member, ShopProvider } from "contexts/shop/shop.provider";
import CartContainer from "containers/cart/cartContainer";
import { useMediaQuery } from "@mui/material";

const MobileCart = dynamic(() => import("containers/mobileCart/mobileCart"));

type Props = {
  data?: IShop;
  children: any;
  memberState: Member;
};

export default function ShopContainer({ data, children, memberState }: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");
  return (
    <ShopProvider memberState={memberState} data={data}>
      <div className={cls.container}>
        <main className={cls.main}>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, { data });
          })}
        </main>
        <div className={cls.cart}>
          {!!data && <CartContainer shop={data} />}
        </div>
        {!!data && !isDesktop && <MobileCart shop={data} />}
      </div>
    </ShopProvider>
  );
}
