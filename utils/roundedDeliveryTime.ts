import { Dayjs } from "dayjs";

export default function roundedDeliveryTime(
  date: Dayjs,
  minuteToAdd: number,
  roundBy: number | undefined = 5
) {
  const deliveryTime = date.format("HH:mm");
  const minutes = Number(deliveryTime.split(":")[1]);
  const rounded = Math.ceil(minutes / roundBy) * roundBy;
  const leftMinutes = rounded - minutes + minuteToAdd;
  return date.add(leftMinutes, "minute").format("HH:mm");
}
