import dayjs from "dayjs";

export default function getBookingStartDate(
  start_date: string,
  min_hour: number = 3,
  interval: number = 30
) {
  const minHour = min_hour - interval / 60;
  return dayjs(start_date)
    .subtract(minHour, "hour")
    .format("YYYY-MM-DD HH:mm:ss");
}
