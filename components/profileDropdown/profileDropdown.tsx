import React from "react";
import cls from "./profileDropdown.module.scss";
import PopoverContainer from "containers/popover/popover";
import { IUser } from "interfaces/user.interface";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import HistoryLineIcon from "remixicon-react/HistoryLineIcon";
import ArchiveLineIcon from "remixicon-react/ArchiveLineIcon";
import Wallet3LineIcon from "remixicon-react/Wallet3LineIcon";
import HeartLineIcon from "remixicon-react/HeartLineIcon";
import FileList3LineIcon from "remixicon-react/FileList3LineIcon";
import Settings3LineIcon from "remixicon-react/Settings3LineIcon";
import QuestionLineIcon from "remixicon-react/QuestionLineIcon";
import LogoutCircleRLineIcon from "remixicon-react/LogoutCircleRLineIcon";
import UserStarLineIcon from "remixicon-react/UserStarLineIcon";
import { useAuth } from "contexts/auth/auth.context";
import usePopover from "hooks/usePopover";
import { useQuery } from "react-query";
import orderService from "services/order";
import qs from "qs";
import { activeOrderStatuses } from "constants/status";
import Price from "components/price/price";
import Avatar from "components/avatar";
import profileService from "services/profile";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import { useSettings } from "contexts/settings/settings.context";
import MapPin2LineIcon from "remixicon-react/MapPin2LineIcon";

type Props = {
  data: IUser;
};

export default function ProfileDropdown({ data }: Props) {
  const { t } = useTranslation();
  const [open, anchorEl, handleOpen, handleClose] = usePopover();
  const { logout, setUserData } = useAuth();
  const currency = useAppSelector(selectCurrency);
  const { settings } = useSettings();
  const activeParcel = Number(settings?.active_parcel) === 1;

  useQuery(
    ["profile", currency?.id],
    () => profileService.get({ currency_id: currency?.id }),
    {
      staleTime: 0,
      onSuccess: (data) => {
        setUserData(data.data);
      },
    }
  );

  const { data: activeOrders } = useQuery(
    "activeOrders",
    () =>
      orderService.getAll(
        qs.stringify({ order_statuses: true, statuses: activeOrderStatuses })
      ),
    { enabled: open }
  );

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <>
      <button className={cls.profileBtn} onClick={handleOpen}>
        <div className={cls.imgWrapper}>
          <Avatar data={data} key={data.img} />
        </div>
      </button>

      <PopoverContainer
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className={cls.wrapper}>
          <header className={cls.header}>
            <div className={cls.naming}>
              <h4 className={cls.title}>
                {data.firstname} {data.lastname?.charAt(0)}.
              </h4>
              <Link
                href={"/profile"}
                className={cls.link}
                onClick={handleClose}
              >
                {t("view.profile")}
              </Link>
            </div>
            <div className={cls.profileImage}>
              <Avatar data={data} key={data.img} />
            </div>
          </header>
          <div className={cls.body}>
            <Link href={"/wallet"} className={cls.flex} onClick={handleClose}>
              <div className={cls.item}>
                <Wallet3LineIcon />
                <span className={cls.text}>{t("wallet")}:</span>
                <span className={cls.bold}>
                  <Price
                    number={data.wallet?.price}
                    symbol={data.wallet?.symbol}
                  />
                </span>
              </div>
            </Link>
            <Link href={"/orders"} className={cls.flex} onClick={handleClose}>
              <div className={cls.item}>
                <HistoryLineIcon />
                <span className={cls.text}>{t("orders")}</span>
              </div>
              {!!activeOrders?.meta?.total && (
                <div className={cls.badge}>{activeOrders?.meta?.total}</div>
              )}
            </Link>
            <Link
              href={"/reservations"}
              className={cls.flex}
              onClick={handleClose}
            >
              <div className={cls.item}>
                <FileList3LineIcon />
                <span className={cls.text}>{t("reservations")}</span>
              </div>
            </Link>
            <Link
              href={"/be-seller"}
              className={cls.flex}
              onClick={handleClose}
            >
              <div className={cls.item}>
                <UserStarLineIcon />
                <span className={cls.text}>{t("be.seller")}</span>
              </div>
            </Link>
            {activeParcel && (
              <Link
                href={"/parcels"}
                className={cls.flex}
                onClick={handleClose}
              >
                <div className={cls.item}>
                  <ArchiveLineIcon />
                  <span className={cls.text}>{t("parcels")}</span>
                </div>
              </Link>
            )}
            <Link href={"/liked"} className={cls.flex} onClick={handleClose}>
              <div className={cls.item}>
                <HeartLineIcon />
                <span className={cls.text}>{t("liked")}</span>
              </div>
            </Link>
            <Link
              href={"/settings/notification"}
              className={cls.flex}
              onClick={handleClose}
            >
              <div className={cls.item}>
                <Settings3LineIcon />
                <span className={cls.text}>{t("settings")}</span>
              </div>
            </Link>
            <Link
              href={"/saved-locations"}
              className={cls.flex}
              onClick={handleClose}
            >
              <div className={cls.item}>
                <MapPin2LineIcon />
                <span className={cls.text}>{t("delivery.addresses")}</span>
              </div>
            </Link>
            <Link href={"/help"} className={cls.flex} onClick={handleClose}>
              <div className={cls.item}>
                <QuestionLineIcon />
                <span className={cls.text}>{t("help")}</span>
              </div>
            </Link>
            <Link href={"/login"} className={cls.flex} onClick={handleLogout}>
              <div className={cls.item}>
                <LogoutCircleRLineIcon />
                <span className={cls.text}>{t("log.out")}</span>
              </div>
            </Link>
          </div>
        </div>
      </PopoverContainer>
    </>
  );
}
