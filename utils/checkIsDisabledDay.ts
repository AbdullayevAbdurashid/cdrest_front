import dayjs, { Dayjs } from "dayjs";
import { IShop } from "interfaces";

function getSchedule(day: Dayjs, data?: IShop) {
  return data?.shop_working_days?.find(
    (item) => item.day?.toLowerCase() === day.format("dddd").toLowerCase()
  );
}

export default function checkIsDisabledDay(dayIndex: number, data?: IShop) {
  const today = dayIndex === 0;
  const day = dayjs().add(dayIndex, "day");
  const date = dayjs().format("YYYY-MM-DD");
  let isTimeAfter = false;
  const foundedSchedule = getSchedule(day, data);
  const isHoliday = data?.shop_closed_date?.some((item) =>
    dayjs(item.day).isSame(day.format("YYYY-MM-DD"))
  );
  if (today) {
    const closedTime = foundedSchedule?.to.replace("-", ":");
    isTimeAfter = dayjs().isAfter(dayjs(`${date} ${closedTime}`));
  }
  const isDisabled = foundedSchedule?.disabled || isHoliday;
  return isDisabled || isTimeAfter;
}
