import React, { useMemo, useState } from "react";
import cls from "./pickers.module.scss";
import usePopover from "hooks/usePopover";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import ErrorWarningLineIcon from "remixicon-react/ErrorWarningLineIcon";
import PopoverContainer from "containers/popover/popover";
import RadioInput from "components/inputs/radioInput";
import { SelectChangeEvent, SelectProps } from "@mui/material";
import useLocale from "hooks/useLocale";
import ModalContainer from "containers/modal/modal";
import { ParcelType } from "interfaces/parcel.interface";
import ParcelShow from "components/parcelShow/parcelShow";

interface Props extends SelectProps {
  options?: {
    label: string;
    value: string;
    data: ParcelType;
  }[];
  type?: "standard" | "outlined";
  icon?: React.ReactElement;
}

export default function RcParcelPicker({
  value,
  name,
  onChange,
  options,
  label,
  error,
  type = "outlined",
  placeholder,
  icon,
}: Props) {
  const { t } = useLocale();
  const [parcel, setParcel] = useState<ParcelType | undefined>(undefined);
  const [open, anchor, handleOpen, handleClose] = usePopover();
  const data = options?.find((el) => el.value == value)?.data;

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
    setParcel(undefined);
  }

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
            {data?.type}{" "}
            {!!data ? (
              <span className={`${cls.muted} ${cls.text}`}>
                ({t("up.to.weight", { number: Number(data?.max_g) / 1000 })})
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </span>
        </div>
        <ArrowDownSLineIcon />
      </div>
      <PopoverContainer open={open} anchorEl={anchor} onClose={handleClose}>
        <div className={`${cls.body} ${cls.wide}`}>
          {options?.map((item) => (
            <div key={item.value} className={cls.row}>
              <RadioInput {...controlProps(String(item.value))} />
              <label className={cls.label} htmlFor={String(item.value)}>
                <span className={cls.text}>
                  {item.label}{" "}
                  <span className={cls.muted}>
                    (
                    {t("up.to.weight", {
                      number: Number(item?.data?.max_g) / 1000,
                    })}
                    )
                  </span>
                </span>
                <button onClick={() => setParcel(item?.data)}>
                  <ErrorWarningLineIcon />
                </button>
              </label>
            </div>
          ))}
          {!options?.length && <div className={cls.row}>{t("not.found")}</div>}
        </div>
      </PopoverContainer>

      <ModalContainer open={Boolean(parcel)} onClose={handleCloseInfo}>
        <ParcelShow data={parcel} />
      </ModalContainer>
    </div>
  );
}
