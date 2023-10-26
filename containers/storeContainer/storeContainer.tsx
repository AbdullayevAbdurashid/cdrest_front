import React, { useRef, useCallback, useEffect } from "react";
import cls from "./storeContainer.module.scss";
import dynamic from "next/dynamic";
import { Category, IShop } from "interfaces";
import { Member, ShopProvider } from "contexts/shop/shop.provider";
import CartContainer from "containers/cart/cartContainer";
import VerticalNavbar from "containers/verticalNavbar/verticalNavbar";
import { useMediaQuery } from "@mui/material";

const MobileCart = dynamic(() => import("containers/mobileCart/mobileCart"));

type Props = {
  data?: IShop;
  children: any;
  memberState: Member;
  categories: Category[];
  categoryLoading?: boolean;
  fetchNextPageCategory: () => void;
  hasNextPageCategory?: boolean;
  isFetchingNextPageCategory?: boolean;
};

export default function StoreContainer({
  data,
  children,
  memberState,
  categories,
  categoryLoading,
  fetchNextPageCategory,
  hasNextPageCategory,
  isFetchingNextPageCategory,
}: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <ShopProvider memberState={memberState} data={data}>
      <div className={`${cls.container} store`}>
        {isDesktop && (
          <div className={cls.navbar}>
            <VerticalNavbar
              categories={categories}
              loading={categoryLoading}
              fetchNextPageCategory={fetchNextPageCategory}
              hasNextPageCategory={hasNextPageCategory}
              isFetchingNextPageCategory={isFetchingNextPageCategory}
            />
          </div>
        )}
        <main className={cls.main}>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, { data, categories });
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
