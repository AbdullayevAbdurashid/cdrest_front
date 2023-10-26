import React from "react";
import { Bonus } from "interfaces";
import { useTranslation } from "react-i18next";
import Price from "components/price/price";

type Props = {
  data: Bonus;
};

export default function BonusCaption({ data }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      {t("under")}{" "}
      {data.type === "sum" ? <Price number={data.value} /> : data.value} +{" "}
      {t("bonus")} {data.bonusStock?.product.translation?.title}
    </div>
  );
}
