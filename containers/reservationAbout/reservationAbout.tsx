import React from "react";
import cls from "./reservationAbout.module.scss";
import useLocale from "hooks/useLocale";
import Map from "components/map/map";
import MapPin2LineIcon from "remixicon-react/MapPin2LineIcon";
import PhoneLineIcon from "remixicon-react/PhoneLineIcon";
import { IBookingSchedule } from "interfaces/booking.interface";

type Props = {
  data?: IBookingSchedule;
};

export default function ReservationAbout({ data }: Props) {
  const { t } = useLocale();
  const location = {
    lat: Number(data?.location?.latitude) || 0,
    lng: Number(data?.location?.longitude) || 0,
  };

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.wrapper}>
          <h1 className={cls.title}>{t("about")}</h1>
          <p className={cls.description}>{data?.translation.description}</p>
          <div className={cls.block}>
            <div className={cls.map}>
              <Map location={location} readOnly />
            </div>
            <div className={cls.flex}>
              <div className={cls.row}>
                <MapPin2LineIcon />
                <span className={cls.text}>{data?.translation?.address}</span>
              </div>
              <div className={cls.row}>
                <PhoneLineIcon />
                <a href={`tel:${data?.phone}`} className={cls.text}>
                  {data?.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
