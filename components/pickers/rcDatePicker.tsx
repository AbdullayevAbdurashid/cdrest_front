import React from "react";
import cls from "./pickers.module.scss";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import dayjs from "dayjs";
import usePopover from "hooks/usePopover";
import PopoverContainer from "containers/popover/popover";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import StaticDatepicker from "components/inputs/staticDatepicker";

type Props = {
  name: string;
  value?: string;
  label?: string;
  onChange: (event: unknown) => void;
  error?: boolean;
  type?: "standard" | "outlined";
  placeholder?: string;
  icon?: React.ReactElement;
};

export default function RcDatePicker({
  name,
  value,
  onChange,
  label,
  error,
  type = "outlined",
  placeholder,
  icon,
}: Props) {
  const [open, anchor, handleOpen, handleClose] = usePopover();

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
            {value
              ? dayjs(value, "YYYY-MM-DD").format("ddd, MMM DD")
              : placeholder}
          </span>
        </div>
        <ArrowDownSLineIcon />
      </div>
      <PopoverContainer open={open} anchorEl={anchor} onClose={handleClose}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatepicker
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={dayjs(value, "YYYY-MM-DD")}
            onChange={(event: any) => {
              onChange(dayjs(event).format("YYYY-MM-DD"));
              handleClose();
            }}
          />
        </LocalizationProvider>
      </PopoverContainer>
    </div>
  );
}
