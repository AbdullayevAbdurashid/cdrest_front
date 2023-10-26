import React, { useState } from "react";
import cls from "./shopInfoDetails.module.scss";
import { IShop } from "interfaces";
import Map from "components/map/map";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import MapPin2FillIcon from "remixicon-react/MapPin2FillIcon";
import FileCopyLineIcon from "remixicon-react/FileCopyLineIcon";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import AddLineIcon from "remixicon-react/AddLineIcon";
import SubtractLineIcon from "remixicon-react/SubtractLineIcon";
import StarFillIcon from "remixicon-react/StarFillIcon";
import { useTranslation } from "react-i18next";
import useShopWorkingSchedule from "hooks/useShopWorkingSchedule";
import { success, error } from "components/alert/toast";

type Props = {
  data?: IShop;
  onClose: () => void;
};

export default function ShopInfoDetails({ data, onClose }: Props) {
  const { t } = useTranslation();
  const location = {
    lat: Number(data?.location?.latitude),
    lng: Number(data?.location?.longitude),
  };
  const { workingSchedule, isShopClosed } = useShopWorkingSchedule(data);
  const [openTime, setOpenTime] = useState(false);

  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(data?.translation?.address || "");
      success(t("copied"));
    } catch (err) {
      error("Failed to copy!");
    }
  };

  return (
    <div className={cls.container}>
      <button className={cls.closeBtn} onClick={onClose}>
        <CloseFillIcon />
      </button>
      <div className={cls.map}>
        <Map location={location} readOnly />
      </div>
      <div className={cls.wrapper}>
        <div className={cls.header}>
          <h2 className={cls.title}>{data?.translation?.title}</h2>
          <p className={cls.text}>
            {data?.tags?.map((item) => item.translation?.title)?.join(" • ")}
          </p>
        </div>
        <div className={cls.body}>
          <div className={cls.flexBtn}>
            <button className={cls.flex} onClick={copyToClipBoard}>
              <MapPin2FillIcon />
              <span className={cls.text}>{data?.translation?.address}</span>
              <FileCopyLineIcon />
            </button>
          </div>
          <div className={cls.flexBtn}>
            <button className={cls.flex} onClick={() => setOpenTime(!openTime)}>
              <TimeFillIcon />
              <span className={cls.text}>
                {isShopClosed
                  ? t("closed")
                  : `${t("open.until")} — ${workingSchedule.to}`}
              </span>
              {openTime ? <SubtractLineIcon /> : <AddLineIcon />}
            </button>
            {openTime && (
              <ul className={cls.details}>
                {data?.shop_working_days?.map((item) => (
                  <li key={"day" + item.id}>
                    <strong>{t(item.day)}: </strong>
                    {`${item.from} — ${item.to}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={cls.flexBtn}>
            <div className={cls.flex}>
              <StarFillIcon />
              <span className={cls.text}>
                {data?.rating_avg?.toFixed(1) || 0}{" "}
                {data?.rating_avg
                  ? `(${data?.reviews_count}+ ${t("ratings")})`
                  : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
