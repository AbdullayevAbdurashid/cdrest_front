import React from "react";
import cls from "./searchResultItem.module.scss";
import { IBookingShop, IShop } from "interfaces";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import useLocale from "hooks/useLocale";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import useShopBookingSchedule from "hooks/useShopBookingSchedule";

type Props = {
  data: IBookingShop;
  onClickItem?: (value: IShop) => void;
};

export default function ShopResultWithoutLinkItem({
  data,
  onClickItem,
}: Props) {
  const { t } = useLocale();
  const { workingSchedule, isShopClosed } = useShopBookingSchedule(data);
  return (
    <div className={cls.row}>
      <button
        className={cls.flex}
        onClick={() => !!onClickItem && onClickItem(data)}
        style={{ width: "100%" }}
      >
        <ShopLogoBackground data={data} />
        <div className={cls.shopNaming}>
          {/* <p className={cls.desc}>{data.translation?.description}</p> */}
          <div className={cls.titleRateContainer}>
            <h4 className={cls.shopTitle}>{data.translation?.title}</h4>
            <div className={`${cls.rating}`}>
              <StarSmileFillIcon />
              <p className={cls.text}>
                <span className={cls.semiBold}>
                  {data?.rating_avg?.toFixed(1) || 0}
                </span>
              </p>
            </div>
          </div>

          <p className={cls.workTime}>
            <span>{t("working.time")}: </span>
            <span className={cls.bold}>
              {isShopClosed
                ? t("closed")
                : `${workingSchedule.from} — ${workingSchedule.to}`}
            </span>
          </p>
        </div>
      </button>
    </div>
  );
}
