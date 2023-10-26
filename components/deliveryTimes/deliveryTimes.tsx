import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RadioInput from "components/inputs/radioInput";
import cls from "./deliveryTimes.module.scss";
import PrimaryButton from "components/button/primaryButton";
import dayjs from "dayjs";
import { IShop } from "interfaces";
import SecondaryButton from "components/button/secondaryButton";
import { WEEK } from "constants/weekdays";
import getTimeSlots, {
  minutesToString,
  stringToMinutes,
} from "utils/getTimeSlots";
import getWeekDay from "utils/getWeekDay";
import checkIsDisabledDay from "utils/checkIsDisabledDay";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper";
import { useMediaQuery } from "@mui/material";

type IDeliveryTime = {
  date: string;
  time: string;
};

type Props = {
  data?: IShop;
  handleClose: () => void;
  handleChangeDeliverySchedule: (data: IDeliveryTime) => void;
};

export default function DeliveryTimes({
  data,
  handleChangeDeliverySchedule,
  handleClose,
}: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [list, setList] = useState<string[]>([]);

  const renderTimes = useCallback(() => {
    let today = dayjs().add(dayIndex, "day");
    const isToday = today.isSame(dayjs());
    const weekDay = WEEK[today.day()];
    const workingSchedule = data?.shop_working_days?.find(
      (item) => item.day === weekDay
    );
    if (workingSchedule && !checkIsDisabledDay(dayIndex, data)) {
      const from = workingSchedule.from.replace("-", ":");
      const to = workingSchedule.to.replace("-", ":");
      const slots = getTimeSlots(from, to, isToday);
      setList(slots);
      setSelectedValue(null);
    } else {
      setList([]);
      setSelectedValue(null);
    }
  }, [dayIndex, data]);

  useEffect(() => {
    renderTimes();
  }, [data, renderTimes]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    id: item,
    name: "delivery_time",
    inputProps: { "aria-label": item },
  });

  const clearValue = () => setSelectedValue(null);

  const submit = () => {
    if (!selectedValue) {
      return;
    }
    const time = renderDeliverySchedule(selectedValue);
    const date = dayjs().add(dayIndex, "day").format("YYYY-MM-DD");
    handleChangeDeliverySchedule({ time, date });
    handleClose();
  };

  function renderDay(index: number) {
    const day = dayjs().add(index, "day");
    return {
      day,
      weekDay: getWeekDay(day),
    };
  }

  function renderDeliverySchedule(time: string) {
    let from = stringToMinutes(time);
    let to = parseInt(data?.delivery_time?.to || "0");
    if (data?.delivery_time?.type === "hour") {
      to = parseInt(data.delivery_time.to) * 60;
    }
    const deliveryTime = minutesToString(from + to);
    return `${time} - ${deliveryTime}`;
  }

  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <h2 className={cls.title}>{t("time_schedule")}</h2>
      </div>
      <div className={cls.tabs}>
        <Swiper
          spaceBetween={16}
          slidesPerView="auto"
          navigation={isDesktop}
          modules={[Navigation, A11y]}
          className="tab-swiper"
          allowTouchMove={!isDesktop}
        >
          {WEEK.map((day, idx) => (
            <SwiperSlide key={day}>
              <button
                type="button"
                className={`${cls.tab} ${dayIndex === idx ? cls.active : ""}`}
                onClick={() => setDayIndex(idx)}
              >
                <span className={cls.text}>{renderDay(idx).weekDay}</span>
                <p className={cls.subText}>
                  {renderDay(idx).day.format("MMM DD")}
                </p>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={cls.body}>
        {list.map((item, index, array) => (
          <div
            key={item}
            className={cls.row}
            style={{ display: array[index + 1] ? "flex" : "none" }}
          >
            <RadioInput {...controlProps(item)} />
            <label className={cls.label} htmlFor={item}>
              <span className={cls.text}>{renderDeliverySchedule(item)}</span>
            </label>
          </div>
        ))}
        {list.length === 0 && <div>{t("shop.closed.choose.other.day")}</div>}
      </div>
      <div className={cls.footer}>
        <div className={cls.action}>
          <PrimaryButton onClick={submit}>{t("save")}</PrimaryButton>
        </div>
        <div className={cls.action}>
          <SecondaryButton onClick={clearValue}>{t("clear")}</SecondaryButton>
        </div>
      </div>
    </div>
  );
}
