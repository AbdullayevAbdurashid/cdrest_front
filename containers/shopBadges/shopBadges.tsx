import React from "react";
import cls from "./shopBadges.module.scss";
import Badge from "components/badge/badge";
import { IShop } from "interfaces";

type Props = {
  data: IShop;
};

export default function ShopBadges({ data }: Props) {
  return (
    <div className={cls.badge}>
      {data.is_recommended && (
        <Badge
          type="popular"
          variant={
            !!data.discount?.length || !!data.bonus ? "circle" : "default"
          }
          size="large"
        />
      )}
      {!!data.discount?.length && (
        <Badge
          type="discount"
          variant={data.is_recommended || !!data.bonus ? "circle" : "default"}
          size="large"
        />
      )}
      {!!data.bonus && (
        <Badge
          type="bonus"
          variant={
            data.is_recommended || !!data.discount?.length
              ? "circle"
              : "default"
          }
          size="large"
        />
      )}
    </div>
  );
}
