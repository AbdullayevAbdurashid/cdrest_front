import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import cls from "./shopFilter.module.scss";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import LeafFillIcon from "remixicon-react/LeafFillIcon";
import SwitchInput from "components/inputs/switchInput";
import DarkButton from "components/button/darkButton";
import SecondaryButton from "components/button/secondaryButton";
import shopService from "services/shop";
import { useQuery } from "react-query";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { selectShopFilter, setGroupFilter } from "redux/slices/shopFilter";
import { IShopTag } from "interfaces";
// import PriceRangeSlider from "components/inputs/priceRangeSlider";

const ratings = [
  { label: "3.5 — 4.5", value: "3.5,4.5" },
  { label: "4.5 — 5.0", value: "4.5,5.0" },
  { label: "5.0", value: "5.0" },
];

type Props = {
  handleClose: () => void;
  parentCategoryId?: number
};

export default function ShopFilter({ handleClose, parentCategoryId }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { group, category_id } = useAppSelector(selectShopFilter);
  const [freeDelivery, setFreeDelivery] = useState(
    Boolean(group.free_delivery)
  );
  const [deals, setDeals] = useState(Boolean(group.deals));
  const [rating, setRating] = useState(group.rating);
  const [prices, setPrices] = useState(group.prices);
  const [tag, setTag] = useState(group.tag);
  const [open, setOpen] = useState(group.open);

  const { data: tags } = useQuery("tags", () => shopService.getAllTags({category_id: parentCategoryId}));
  // const { data: avgPrices } = useQuery(
  //   "avg-prices",
  //   () => shopService.getAveragePrices(),
  //   {
  //     onSuccess: (data) => {
  //       if (!prices) {
  //         setPrices([data.data.min, data.data.max]);
  //       }
  //     },
  //   }
  // );

  const handleShowResult = () => {
    const payload = {
      tag,
      rating,
      free_delivery: freeDelivery || undefined,
      prices,
      deals: deals || undefined,
      open,
    };
    dispatch(setGroupFilter(payload));
    handleClose();
  };

  const handleClearFilter = () => {
    dispatch(setGroupFilter({}));
    handleClose();
  };

  return (
    <div className={cls.wrapper}>
      {/* <div className={cls.block}> */}
      {/* <h4 className={cls.title}>{t("price")}</h4> */}
      {/* {avgPrices?.data ? (
          <PriceRangeSlider
            value={prices || [avgPrices.data.min, avgPrices.data.max]}
            onChange={(event: any) => setPrices(event.target.value)}
          />
        ) : (
          ""
        )} */}
      {/* </div> */}
      <div className={cls.block}>
        <h4 className={cls.title}>{t("rating")}</h4>
        <div className={cls.flex}>
          {ratings.map((item) => (
            <button
              key={item.value}
              className={`${cls.flexItem} ${
                item.value === rating ? cls.active : ""
              }`}
              onClick={() => setRating(item.value)}
            >
              <StarSmileFillIcon />
              <span className={cls.text}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div
        className={cls.block}
        style={{ display: tags?.data?.length > 0 ? "block" : "none" }}
      >
        <h4 className={cls.title}>{t("special.offers")}</h4>
        <div className={cls.flex}>
          {tags?.data?.map((item: IShopTag) => (
            <button
              key={"tag" + item.id}
              className={`${cls.flexItem} ${
                tag === String(item.id) ? cls.active : ""
              }`}
              onClick={() => setTag(String(item.id))}
            >
              <LeafFillIcon />
              <span className={cls.text}>{item.translation?.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={cls.row}>
        <h4 className={cls.title}>{t("deals")}</h4>
        <div className={cls.switch}>
          <SwitchInput
            name="deals"
            checked={deals}
            onChange={(event) => setDeals(event.target.checked)}
          />
          <div className={cls.value}>{deals ? t("on") : t("off")}</div>
        </div>
      </div>
      <div className={cls.row}>
        <h4 className={cls.title}>{t("free.delivery")}</h4>
        <div className={cls.switch}>
          <SwitchInput
            name="free_delivery"
            checked={freeDelivery}
            onChange={(event) => setFreeDelivery(event.target.checked)}
          />
          <div className={cls.value}>{freeDelivery ? t("on") : t("off")}</div>
        </div>
      </div>
      <div className={cls.row}>
        <h4 className={cls.title}>{t("only.opened")}</h4>
        <div className={cls.switch}>
          <SwitchInput
            name="open"
            checked={open}
            onChange={(event) => setOpen(event.target.checked)}
          />
          <div className={cls.value}>{open ? t("on") : t("off")}</div>
        </div>
      </div>
      <div className={cls.actions}>
        <DarkButton size="small" onClick={handleShowResult}>
          {t("show")}
        </DarkButton>
        <SecondaryButton size="small" onClick={handleClearFilter}>
          {t("clear")}
        </SecondaryButton>
      </div>
    </div>
  );
}
