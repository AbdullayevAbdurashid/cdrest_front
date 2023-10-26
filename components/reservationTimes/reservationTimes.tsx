import React from "react";
import cls from "./reservationTimes.module.scss";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import useLocale from "hooks/useLocale";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import dayjs from "dayjs";
import { WEEK } from "constants/weekdays";
import getTimeSlots from "utils/getTimeSlots";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import {
  IBookingDisabledDate,
  IBookingSchedule,
} from "interfaces/booking.interface";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isToday from "dayjs/plugin/isToday";
import TimeSlot from "./timeSlot";
import { useRouter } from "next/router";
import Booking from "components/booking/booking";
import { useSettings } from "contexts/settings/settings.context";
import getBookingStartDate from "utils/getBookingStartDate";
import getBookingEndDate from "utils/getBookingEndDate";
import { useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";

const ModalContainer = dynamic(() => import("containers/modal/modal"));
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);

type Props = {
  data?: IBookingSchedule;
  disabledDates?: IBookingDisabledDate[];
  validateForm: () => Promise<any>;
};

export default function ReservationTimes({
  data,
  disabledDates,
  validateForm,
}: Props) {
  const { t } = useLocale();
  const { query, replace } = useRouter();
  const { settings } = useSettings();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const dateFrom = String(query.date_from || "") || undefined;
  const dateTo = String(query.date_to || "") || undefined;
  const isWeekly = Boolean(dateTo);
  const bookingDate = String(query.booking_date || "") || undefined;
  const isTodayOrBefore = dayjs(dateFrom).isSameOrBefore(new Date(), "day");
  const reservationTimeInterval = settings?.reservation_time_durations;
  const reservationValidBeforeHour = settings?.reservation_before_time;
  const minReservationHour = settings?.min_reservation_time;

  function showWeekly() {
    const date_to = dayjs(dateFrom).add(7, "day").format("YYYY-MM-DD");
    updateSchedule({ date_to });
  }

  function nextWeek() {
    const day = 8 - dayjs(dateFrom).day();
    const date_from = dayjs(dateFrom).add(day, "day").format("YYYY-MM-DD");
    const date_to = dayjs(date_from).add(6, "day").format("YYYY-MM-DD");
    updateSchedule({ date_from, date_to });
  }

  function prevWeek() {
    const day = dayjs(dateFrom).day() + 6;
    const date_from = dayjs(dateFrom).subtract(day, "day").format("YYYY-MM-DD");
    const date_to = dayjs(date_from).add(6, "day").format("YYYY-MM-DD");
    updateSchedule({ date_from, date_to });
  }

  function getSchedule(dayIndex?: number) {
    let exactDate = dayjs(dateFrom);
    let slots: string[] = [];
    let freeSlots: string[] = [];
    if (dayIndex) {
      exactDate = exactDate.add(dayIndex, "day");
    }
    const today = exactDate.day();
    const exactDateString = exactDate.format("YYYY-MM-DD");
    const isToday = exactDate.isToday();
    const weekDay = WEEK[today];
    const workingSchedule = data?.booking_shop_working_days?.find(
      (item) => item.day === weekDay && !item.disabled
    );
    const isHoliday = data?.booking_shop_closed_date?.some((item) =>
      dayjs(item.day).isSame(exactDateString)
    );
    if (workingSchedule && !isHoliday) {
      const from = workingSchedule.from.replace("-", ":");
      const to = workingSchedule.to.replace("-", ":");
      slots = getTimeSlots(from, to, isToday, reservationTimeInterval);
    }
    slots.forEach((item) => {
      const isFree = !disabledDates?.find((el) =>
        dayjs(`${exactDateString} ${item}:00`).isBetween(
          getBookingStartDate(
            el.start_date,
            minReservationHour,
            reservationTimeInterval
          ),
          getBookingEndDate(el.start_date, el.end_date, minReservationHour),
          "minute",
          "[)"
        )
      );
      const isBookingValid = dayjs(`${exactDateString} ${item}:00`)
        .subtract(reservationValidBeforeHour, "hour")
        .isAfter(dayjs());
      if (isFree && isBookingValid) {
        freeSlots.push(item);
      }
    });
    return { slots: freeSlots, date: exactDate };
  }

  function updateSchedule(params: any) {
    replace(
      {
        query: {
          ...query,
          ...params,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  function selectTimeSlot(date: string) {
    validateForm().then((res) => {
      const size = Object.keys(res).length;
      if (!size) {
        updateSchedule({ booking_date: date });
      }
    });
  }

  return (
    <div className={cls.wrapper}>
      {!isWeekly && (
        <div className={cls.singleRow}>
          <TimeSlot schedule={getSchedule()} onSelect={selectTimeSlot} />
          <div className={cls.actions}>
            <button className={cls.buttonLink} onClick={showWeekly}>
              <ArrowDownSLineIcon />
              <span className={cls.text}>{t("see.all.reservation")}</span>
            </button>
          </div>
        </div>
      )}
      {isWeekly && (
        <>
          <div className={cls.actions}>
            <button
              className={cls.buttonLink}
              onClick={prevWeek}
              disabled={isTodayOrBefore}
            >
              <ArrowLeftSLineIcon />
              <span className={cls.text}>{t("prev.week")}</span>
            </button>
            <button className={cls.buttonLink} onClick={nextWeek}>
              <span className={cls.text}>{t("next.week")}</span>
              <ArrowRightSLineIcon />
            </button>
          </div>
          {WEEK.map((item, idx) => (
            <TimeSlot
              key={item}
              schedule={getSchedule(idx)}
              onSelect={selectTimeSlot}
            />
          ))}
        </>
      )}
      {isDesktop ? (
        <ModalContainer
          open={Boolean(bookingDate)}
          onClose={() => updateSchedule({ booking_date: undefined })}
        >
          <Booking
            data={data}
            handleClose={() => updateSchedule({ booking_date: undefined })}
          />
        </ModalContainer>
      ) : (
        <MobileDrawer
          open={Boolean(bookingDate)}
          onClose={() => updateSchedule({ booking_date: undefined })}
        >
          <Booking
            data={data}
            handleClose={() => updateSchedule({ booking_date: undefined })}
          />
        </MobileDrawer>
      )}
    </div>
  );
}
