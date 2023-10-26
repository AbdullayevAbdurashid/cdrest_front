import React from "react";
import cls from "./chat.module.scss";
import Message3LineIcon from "remixicon-react/Message3LineIcon";
import { useRouter } from "next/router";

type Props = {
  handleClick: () => void;
};

const shopRoutes = ["/restaurant/[id]", "/shop/[id]"];

export default function RippleButton({ handleClick }: Props) {
  const { pathname } = useRouter();
  const isShopRoutes = !!shopRoutes.find((item) => item === pathname);

  return (
    <div className={`${cls.rippleBtn} ${isShopRoutes ? cls.left : ""}`}>
      <button onClick={handleClick}>
        <Message3LineIcon />
      </button>
    </div>
  );
}
