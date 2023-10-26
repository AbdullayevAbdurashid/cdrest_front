import dayjs from "dayjs";

export default function getBookingEndDate(
  start_date: string,
  end_date?: string,
  min_hour: number = 3
) {
  if (end_date) return end_date;
  return dayjs(start_date).add(min_hour, "hour").format("YYYY-MM-DD HH:mm:ss");
}
