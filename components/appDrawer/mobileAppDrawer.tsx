import React from "react";
import cls from "./appDrawer.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ProfileCard from "components/profileCard/profileCard";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import BankCardLineIcon from "remixicon-react/BankCardLineIcon";
import GlobalLineIcon from "remixicon-react/GlobalLineIcon";
import HeartLineIcon from "remixicon-react/HeartLineIcon";
import HistoryLineIcon from "remixicon-react/HistoryLineIcon";
import ArchiveLineIcon from "remixicon-react/ArchiveLineIcon";
import Wallet3LineIcon from "remixicon-react/Wallet3LineIcon";
import QuestionLineIcon from "remixicon-react/QuestionLineIcon";
import Settings3LineIcon from "remixicon-react/Settings3LineIcon";
import UserStarLineIcon from "remixicon-react/UserStarLineIcon";
import { useAuth } from "contexts/auth/auth.context";
import useModal from "hooks/useModal";
import MobileDrawer from "containers/drawer/mobileDrawer";
import LanguagePopover from "components/languagePopover/languagePopover";
import CurrencyList from "components/currencyList/currencyList";
import { useQuery } from "react-query";
import orderService from "services/order";
import qs from "qs";
import { activeOrderStatuses } from "constants/status";
import Price from "components/price/price";
import MapPin2LineIcon from "remixicon-react/MapPin2LineIcon";

type Props = {
  handleClose: () => void;
};

export default function MobileAppDrawer({ handleClose }: Props) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [langDrawer, handleOpenLangDrawer, handleCloseLangDrawer] = useModal();
  const [currencyDrawer, handleOpenCurrencyDrawer, handleCloseCurrencyDrawer] =
    useModal();

  const { data: activeOrders } = useQuery(
    "activeOrders",
    (): Promise<any> =>
      orderService.getAll(
        qs.stringify({ order_statuses: true, statuses: activeOrderStatuses })
      ),
    { retry: false, enabled: isAuthenticated }
  );

  return (
    <>
      <div className={cls.body}>
        {isAuthenticated && (
          <ProfileCard data={user} handleClose={handleClose} />
        )}
        {isAuthenticated && (
          <Link href={"/wallet"} className={cls.row} onClick={handleClose}>
            <div className={cls.rowItem}>
              <Wallet3LineIcon />
              <span className={cls.text}>{t("wallet")}:</span>
              <span className={cls.bold}>
                <Price
                  number={user.wallet?.price}
                  symbol={user.wallet?.symbol}
                />
              </span>
            </div>
            <ArrowRightSLineIcon />
          </Link>
        )}
        {isAuthenticated && (
          <Link href={"/orders"} className={cls.row} onClick={handleClose}>
            <div className={cls.rowItem}>
              <HistoryLineIcon />
              <span className={cls.text}>{t("orders")}</span>
              {activeOrders?.meta?.total > 0 && (
                <div className={cls.badge}>{activeOrders?.meta?.total}</div>
              )}
            </div>
            <ArrowRightSLineIcon />
          </Link>
        )}
        <Link href={"/be-seller"} className={cls.row} onClick={handleClose}>
          <div className={cls.rowItem}>
            <UserStarLineIcon />
            <span className={cls.text}>{t("be.seller")}</span>
          </div>
          <ArrowRightSLineIcon />
        </Link>
        {isAuthenticated && (
          <Link href={"/parcels"} className={cls.row} onClick={handleClose}>
            <div className={cls.rowItem}>
              <ArchiveLineIcon />
              <span className={cls.text}>{t("parcels")}</span>
            </div>
            <ArrowRightSLineIcon />
          </Link>
        )}
        <Link href={"/liked"} className={cls.row} onClick={handleClose}>
          <div className={cls.rowItem}>
            <HeartLineIcon />
            <span className={cls.text}>{t("liked")}</span>
          </div>
          <ArrowRightSLineIcon />
        </Link>
        {isAuthenticated && (
          <Link
            href={"/settings/notification"}
            className={cls.row}
            onClick={handleClose}
          >
            <div className={cls.rowItem}>
              <Settings3LineIcon />
              <span className={cls.text}>{t("settings")}</span>
            </div>
            <ArrowRightSLineIcon />
          </Link>
        )}
         {isAuthenticated && (
          <Link href={"/saved-locations"} className={cls.row} onClick={handleClose}>
            <div className={cls.rowItem}>
              <MapPin2LineIcon />
              <span className={cls.text}>{t("delivery.addresses")}</span>
            </div>
            <ArrowRightSLineIcon />
          </Link>
        )}
        {isAuthenticated && (
          <Link href={"/help"} className={cls.row} onClick={handleClose}>
            <div className={cls.rowItem}>
              <QuestionLineIcon />
              <span className={cls.text}>{t("help")}</span>
            </div>
            <ArrowRightSLineIcon />
          </Link>
        )}
        <Link href={"/"} className={cls.row} onClick={handleOpenLangDrawer}>
          <div className={cls.rowItem}>
            <GlobalLineIcon />
            <span className={cls.text}>{t("languages")}</span>
          </div>
          <ArrowRightSLineIcon />
        </Link>
        <Link href={"/"} className={cls.row} onClick={handleOpenCurrencyDrawer}>
          <div className={cls.rowItem}>
            <BankCardLineIcon />
            <span className={cls.text}>{t("currency")}</span>
          </div>
          <ArrowRightSLineIcon />
        </Link>
      </div>
      <MobileDrawer open={langDrawer} onClose={handleCloseLangDrawer}>
        <LanguagePopover onClose={handleCloseLangDrawer} />
      </MobileDrawer>
      <MobileDrawer open={currencyDrawer} onClose={handleCloseCurrencyDrawer}>
        <CurrencyList onClose={handleCloseCurrencyDrawer} />
      </MobileDrawer>
    </>
  );
}
