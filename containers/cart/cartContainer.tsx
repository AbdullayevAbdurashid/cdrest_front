import React from "react";
import { IShop } from "interfaces";
import { useAuth } from "contexts/auth/auth.context";
import { useShop } from "contexts/shop/shop.context";
import MemberCart from "./memberCart";
import ProtectedCart from "./protectedCart";
import Cart from "./cart";

type Props = {
  shop: IShop;
};

export default function CartContainer({ shop }: Props) {
  const { isMember } = useShop();
  const { isAuthenticated } = useAuth();

  if (isMember) {
    return <MemberCart shop={shop} />;
  } else if (isAuthenticated) {
    return <ProtectedCart shop={shop} />;
  } else {
    return <Cart shop={shop} />;
  }
}
