import React, { useState } from "react";
import cls from "./pickers.module.scss";
import usePopover from "hooks/usePopover";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import ErrorWarningLineIcon from "remixicon-react/ErrorWarningLineIcon";
import PopoverContainer from "containers/popover/popover";
import RadioInput from "components/inputs/radioInput";
import { SelectChangeEvent, SelectProps } from "@mui/material";
import useLocale from "hooks/useLocale";
import { IBookingZone } from "interfaces/booking.interface";
import ModalContainer from "containers/modal/modal";
import ZoneShow from "components/zoneShow/zoneShow";

interface Props extends SelectProps {
  options?: {
    label: string;
    value: string;
    data: IBookingZone;
  }[];
}

export default function RcZonePicker({
  value,
  name,
  onChange,
  options,
  label,
  error,
}: Props) {
  const { t } = useLocale();
  const [zoneId, setZoneId] = useState<string | undefined>(undefined);
  const [open, anchor, handleOpen, handleClose] = usePopover();

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (onChange) onChange(event, undefined);
    handleClose();
  };

  const controlProps = (item: string) => ({
    checked: String(value) === item,
    onChange: handleChange,
    value: item,
    id: item,
    name,
    inputProps: { "aria-label": item },
  });

  function handleCloseInfo() {
    setZoneId(undefined);
  }

  return (
    <div className={cls.container}>
      {!!label && <h4 className={cls.title}>{label}</h4>}
      <div
        className={`${cls.wrapper} ${error ? cls.error : ""}`}
        onClick={handleOpen}
      >
        <span className={cls.text}>
          {options?.find((el) => el.value === value)?.label}
        </span>
        <ArrowDownSLineIcon />
      </div>
      <PopoverContainer open={open} anchorEl={anchor} onClose={handleClose}>
        <div className={cls.body}>
          {options?.map((item) => (
            <div key={item.value} className={cls.row}>
              <RadioInput {...controlProps(String(item.value))} />
              <label className={cls.label} htmlFor={String(item.value)}>
                <span className={cls.text}>{item.label}</span>
                <button onClick={() => setZoneId(item.value)}>
                  <ErrorWarningLineIcon />
                </button>
              </label>
            </div>
          ))}
          {!options?.length && <div className={cls.row}>{t("not.found")}</div>}
        </div>
      </PopoverContainer>

      <ModalContainer open={Boolean(zoneId)} onClose={handleCloseInfo}>
        <ZoneShow zoneId={zoneId} />
      </ModalContainer>
    </div>
  );
}
