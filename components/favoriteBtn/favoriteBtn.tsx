import React from "react";
import cls from "./favoriteBtn.module.scss";
import Heart3LineIcon from "remixicon-react/Heart3LineIcon";
import Heart3FillIcon from "remixicon-react/Heart3FillIcon";

type Props = {
  checked: boolean;
  onClick: () => void;
};

export default function FavoriteBtn({ checked, onClick }: Props) {
  return (
    <button type="button" className={cls.wrapper} onClick={onClick}>
      {checked ? <Heart3FillIcon /> : <Heart3LineIcon />}
    </button>
  );
}
