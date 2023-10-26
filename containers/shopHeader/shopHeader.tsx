import React, { useMemo } from "react";
import cls from "./shopHeader.module.scss";
import { IShop } from "interfaces";
import TimeLineIcon from "remixicon-react/TimeLineIcon";
import RunFillIcon from "remixicon-react/RunFillIcon";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import CouponLineIcon from "remixicon-react/CouponLineIcon";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import { useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import {
  addToLiked,
  removeFromLiked,
  selectLikedRestaurants,
} from "redux/slices/favoriteRestaurants";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import BonusCaption from "components/bonusCaption/bonusCaption";
import Price from "components/price/price";
import Badge from "components/badge/badge";
import { useRouter } from "next/router";
import useShopWorkingSchedule from "hooks/useShopWorkingSchedule";
import { selectCurrency } from "redux/slices/currency";
import { useSettings } from "contexts/settings/settings.context";
import getShortTimeType from "utils/getShortTimeType";
import useLocale from "hooks/useLocale";
import VerifiedComponent from "components/verifiedComponent/verifiedComponent";

const JoinGroupContainer = dynamic(
  () => import("containers/joinGroupContainer/joinGroupContainer")
);
const FavoriteBtn = dynamic(
  () => import("components/favoriteBtn/favoriteBtn"),
  { ssr: false }
);
const GroupOrderButton = dynamic(
  () => import("components/groupOrderButton/groupOrderButton")
);
const SupportBtn = dynamic(() => import("components/favoriteBtn/supportBtn"));
const ShopShare = dynamic(() => import("components/shopShare/shopShare"));
const ShopInfo = dynamic(() => import("containers/shopInfo/shopInfo"));

type Props = {
  data?: IShop;
};

export default function ShopHeader({ data }: Props) {
  const { t } = useLocale();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const dispatch = useAppDispatch();
  const favoriteRestaurants = useAppSelector(selectLikedRestaurants);
  const { query } = useRouter();
  const { workingSchedule, isShopClosed } = useShopWorkingSchedule(data);
  const currency = useAppSelector(selectCurrency);
  const { settings } = useSettings();
  const isGroupOrderActive = settings.group_order == 1;

  const isLiked = useMemo(
    () => !!favoriteRestaurants.find((el) => el.uuid === data?.uuid),
    [favoriteRestaurants, data]
  );

  function toggleLike() {
    if (data) {
      if (isLiked) {
        dispatch(removeFromLiked(data));
      } else {
        dispatch(addToLiked(data));
      }
    }
  }

  return (
    <div className={cls.header}>
      <div className="shop-container">
        <div className={cls.row}>
          <div className={cls.shopBrand}>
            <ShopLogoBackground data={data} size="large" />
            <div className={cls.naming}>
              <h1 className={cls.title}>
                {data?.translation?.title}
                {data?.verify === 1 && <VerifiedComponent />}
              </h1>
              <p className={cls.description}>
                {data?.translation?.description}
              </p>
              <ShopInfo data={data} />
            </div>
          </div>
          <div className={cls.statusBox}>
            <div className={cls.actions}>
              <div className={cls.flex}>
                {data?.is_recommended && (
                  <Badge
                    type="popular"
                    variant={isDesktop ? "default" : "circle"}
                  />
                )}
                {!!data?.discount?.length && (
                  <Badge
                    type="discount"
                    variant={isDesktop ? "default" : "circle"}
                  />
                )}
                {!!data?.bonus && (
                  <Badge
                    type="bonus"
                    variant={isDesktop ? "default" : "circle"}
                  />
                )}
              </div>
              <FavoriteBtn checked={isLiked} onClick={toggleLike} />
              <SupportBtn />
              <ShopShare data={data} />
            </div>
          </div>
        </div>
        <div className={cls.flex}>
          <div className={cls.shopInfo}>
            <div className={cls.item}>
              <TimeLineIcon />
              <p className={cls.text}>
                <span>{t("working.time")}: </span>
                <span className={cls.bold}>
                  {isShopClosed
                    ? t("closed")
                    : `${workingSchedule.from} — ${workingSchedule.to}`}
                </span>
              </p>
            </div>
            <div className={cls.dot} />
            <div className={`${cls.item} ${cls.rating}`}>
              <StarSmileFillIcon />
              <p className={cls.text}>
                <span></span>
                <span className={cls.semiBold}>
                  {data?.rating_avg?.toFixed(1) || 0}
                </span>
              </p>
            </div>
            <div className={cls.dot} />
            <div className={`${cls.item} ${cls.delivery}`}>
              <span className={cls.badge} />
              <RunFillIcon />
              <p className={cls.text}>
                <span></span>
                <span className={cls.semiBold}>
                  {data?.delivery_time?.from}-{data?.delivery_time?.to}{" "}
                  {t(getShortTimeType(data?.delivery_time?.type))}
                </span>
              </p>
            </div>
            <div className={cls.dot} />
            <div className={cls.item}>
              <CouponLineIcon />
              <p className={cls.text}>
                <span>{t("delivery")} — </span>
                <span className={cls.bold}>
                  <Price
                    number={Number(data?.price) * Number(currency?.rate)}
                  />
                </span>
              </p>
            </div>
          </div>
          {isGroupOrderActive && (
            <div className={cls.actions}>
              <GroupOrderButton />
            </div>
          )}
        </div>
        {!!data?.bonus && (
          <div className={cls.flex}>
            <div className={cls.bonus}>
              <Badge type="bonus" variant="circle" />
              <BonusCaption data={data?.bonus} />
            </div>
          </div>
        )}

        {query.g ? <JoinGroupContainer /> : ""}
      </div>
    </div>
  );
}
