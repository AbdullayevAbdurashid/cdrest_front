import { useMemo } from "react";
import dayjs from "dayjs";
import { IBookingShop, IShop, ShopWorkingDays } from "interfaces";
import { WEEK } from "constants/weekdays";

export default function useShopBookingSchedule(data?: IBookingShop) {
  const { workingSchedule, isShopClosed, isOpen } = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const weekDay = WEEK[dayjs().day()];
    const foundedSchedule = data?.booking_shop_working_days?.find(
      (item) => item.day === weekDay
    );
    const isHoliday = data?.booking_shop_closed_date?.some((item) =>
      dayjs(item.day).isSame(dayjs())
    );
    const isClosed = !data?.open || isHoliday;
    let schedule = {} as ShopWorkingDays;
    let isTimePassed: boolean = false;

    try {
      if (foundedSchedule) {
        schedule = { ...foundedSchedule };
        schedule.from = schedule.from.replace("-", ":");
        schedule.to = schedule.to.replace("-", ":");
        isTimePassed = dayjs().isAfter(`${today} ${schedule.to}`);
      }
    } catch (err) {
      console.log("err => ", err);
    }

    return {
      workingSchedule: schedule,
      isShopClosed: schedule.disabled || isClosed || isTimePassed,
      isOpen: Boolean(data?.open),
    };
  }, [data]);

  return { workingSchedule, isShopClosed, isOpen };
}
