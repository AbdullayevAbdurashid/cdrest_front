import React from "react";
import cls from "./pickers.module.scss";
import usePopover from "hooks/usePopover";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import PopoverContainer from "containers/popover/popover";
import RadioInput from "components/inputs/radioInput";
import { SelectChangeEvent, SelectProps } from "@mui/material";
import useLocale from "hooks/useLocale";

interface Props extends SelectProps {
  options?: {
    label: string;
    value: string;
  }[];
  type?: "standard" | "outlined";
  icon?: React.ReactElement;
}

export default function RcSelect({
  value,
  name,
  onChange,
  options,
  label,
  error,
  type = "outlined",
  icon,
  placeholder
}: Props) {
  const { t } = useLocale();
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
            {options?.find((el) => el.value == value)?.label || placeholder}
          </span>
        </div>
        <ArrowDownSLineIcon />
      </div>
      <PopoverContainer open={open} anchorEl={anchor} onClose={handleClose}>
        <div className={cls.body}>
          {options?.map((item, idx) => (
            <div key={`${name}-${idx}`} className={cls.row}>
              <RadioInput {...controlProps(String(item.value))} />
              <label className={cls.label} htmlFor={String(item.value)}>
                <span className={cls.text}>{item.label}</span>
              </label>
            </div>
          ))}
          {!options?.length && <div className={cls.row}>{t("not.found")}</div>}
        </div>
      </PopoverContainer>
    </div>
  );
}
