import React from "react";
import cls from "./notificationCenterItem.module.scss";
import {
  IUserPushNotification,
  NotificationStatus,
} from "interfaces/user.interface";
import Avatar from "components/avatar";
import dayjs from "dayjs";
import useLocale from "hooks/useLocale";

type Props = {
  data: IUserPushNotification;
  handleClick: (data: IUserPushNotification) => void;
};

export default function NotificationCenterItem({ data, handleClick }: Props) {
  const { t } = useLocale();

  const renderTitle = () => {
    switch (data.type) {
      case NotificationStatus.STATUS_CHANGED:
        return t("order") + " #" + data.title;
      case NotificationStatus.BOOKING_STATUS:
        return t("reservation") + " #" + data.title;
      default:
        return data.body;
    }
  };
  const renderBody = () => {
    switch (data.type) {
      case NotificationStatus.NEWS_PUBLISH:
        return "";
      default:
        return data.body;
    }
  };

  return (
    <div className={cls.wrapper} onClick={() => handleClick(data)}>
      <div className={cls.imgWrapper}>
        <Avatar data={data.client} />
      </div>
      <div className={cls.block}>
        <div className={cls.naming}>
          <h4 className={cls.title}>{renderTitle()}</h4>
          {!data.read_at && <span className={cls.dot} />}
        </div>
        <p className={cls.text}>{renderBody()}</p>
        <span className={cls.muted}>
          {dayjs(data.created_at).format("DD.MM.YYYY, HH:mm")}
        </span>
      </div>
    </div>
  );
}
