import React from "react";
import cls from "./pickers.module.scss";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import dayjs from "dayjs";
import usePopover from "hooks/usePopover";
import PopoverContainer from "containers/popover/popover";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import StaticDatepicker from "components/inputs/staticDatepicker";
import RadioInput from "components/inputs/radioInput";
import { useTranslation } from "react-i18next";

type Props = {
  name: string;
  date?: string;
  time?: string;
  label?: string;
  onTimeChange: (event: unknown) => void;
  onDateChange: (event: unknown) => void;
  error?: boolean;
  type?: "standard" | "outlined";
  placeholder?: string;
  icon?: React.ReactElement;
  options?: {
    label: string;
    value: string;
  }[];
};

export default function RcDateTimePicker({
  name,
  date,
  time,
  onDateChange,
  onTimeChange,
  label,
  error,
  type = "outlined",
  placeholder,
  icon,
  options,
}: Props) {
  const [open, anchor, handleOpen, handleClose] = usePopover();
  const { t } = useTranslation();

  const controlProps = (item: string) => ({
    checked: String(time) === item,
    onChange: (e: any) => {
      onTimeChange(e);
      handleClose();
    },
    value: item,
    id: item,
    name,
    inputProps: { "aria-label": item },
  });

  return (
    <div className={`${cls.container} ${cls[type]}`}>
      {!!label && <h4 className={cls.title}>{label}</h4>}
      <div
        className={`${cls.wrapper} ${error ? cls.error : ""}`}
        onClick={handleOpen}
      >
        <div className={cls.iconWrapper}>
          {icon}
          <span className={cls.text}>
            {dayjs(date, "YYYY-MM-DD").format("ddd, MMM DD")} {time}
          </span>
        </div>
        <ArrowDownSLineIcon />
      </div>
      <PopoverContainer open={open} anchorEl={anchor} onClose={handleClose}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className={cls.popover}>
            <StaticDatepicker
              displayStaticWrapperAs="desktop"
              openTo="day"
              value={dayjs(date, "YYYY-MM-DD")}
              onChange={(event: any) => {
                onDateChange(dayjs(event).format("YYYY-MM-DD"));
                handleClose();
              }}
            />
            <div className={cls.body}>
              {options?.map((item, idx) => (
                <div key={`${name}-${idx}`} className={cls.row}>
                  <RadioInput {...controlProps(String(item.value))} />
                  <label className={cls.label} htmlFor={String(item.value)}>
                    <span className={cls.text}>{item.label}</span>
                  </label>
                </div>
              ))}
              {!options?.length && (
                <div className={cls.row}>{t("not.found")}</div>
              )}
            </div>
          </div>
        </LocalizationProvider>
      </PopoverContainer>
    </div>
  );
}
