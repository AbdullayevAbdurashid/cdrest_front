import i18n from "i18n";
import dayjs, { Dayjs } from "dayjs";

export default function getWeekDay(day: Dayjs) {
  const isToday = day.isSame(dayjs());
  const isTomorrow = day.isSame(dayjs().add(1, "day"));

  if (isToday) {
    return i18n.t("today");
  } else if (isTomorrow) {
    return i18n.t("tomorrow");
  } else {
    return day.format("dddd");
  }
}
