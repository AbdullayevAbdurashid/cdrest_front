import dayjs, { Dayjs } from "dayjs";
import { IShop } from "interfaces";
import checkIsDisabledDay from "./checkIsDisabledDay";
import roundedDeliveryTime from "./roundedDeliveryTime";

function getSchedule(day: Dayjs, data: IShop) {
  return data?.shop_working_days?.find(
    (item) => item.day?.toLowerCase() === day.format("dddd").toLowerCase()
  );
}

export default function getFirstValidDate(data: IShop) {
  let estimatedDeliveryDuration = Number(data?.delivery_time?.to);
  if (data?.delivery_time?.type === "hour") {
    estimatedDeliveryDuration = estimatedDeliveryDuration * 60;
  }
  let date: string = "";
  let time: string = "";
  for (let index = 0; index < 7; index++) {
    const isToday = index === 0;
    if (!checkIsDisabledDay(index, data)) {
      date = dayjs().add(index, "day").format("YYYY-MM-DD");
      if (isToday) {
        time = roundedDeliveryTime(
          dayjs().add(index, "day"),
          estimatedDeliveryDuration
        );
      } else {
        const day = dayjs().add(index, "day");
        const foundedSchedule = getSchedule(day, data);
        const openTime = foundedSchedule?.from?.replace("-", ":");
        time = roundedDeliveryTime(
          dayjs(`${date} ${openTime}`),
          estimatedDeliveryDuration
        );
      }
      break;
    }
  }
  return {
    date,
    time,
  };
}
