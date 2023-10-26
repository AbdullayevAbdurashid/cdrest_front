import React from "react";
import cls from "./pickers.module.scss";
import usePopover from "hooks/usePopover";
import { FormikProps } from "formik";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import PopoverContainer from "containers/popover/popover";
import RadioInput from "components/inputs/radioInput";
import useLocale from "hooks/useLocale";

type Props = {
  name: string;
  value?: number;
  formik: FormikProps<any>;
};

const list = [1, 2, 3, 4, 5, 6, 7, 8];

export default function RcPersonPicker({ value, name, formik }: Props) {
  const { t } = useLocale();
  const [open, anchor, handleOpen, handleClose] = usePopover();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(name, event.target.value);
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
    <>
      <div className={cls.wrapper} onClick={handleOpen}>
        <span className={cls.text} style={{ textTransform: "lowercase" }}>
          {value} {Number(value) > 1 ? t("people") : t("person")}
        </span>
        <ArrowDownSLineIcon />
      </div>
      <PopoverContainer open={open} anchorEl={anchor} onClose={handleClose}>
        <div className={cls.body}>
          {list.map((item) => (
            <div key={item} className={cls.row}>
              <RadioInput {...controlProps(String(item))} />
              <label className={cls.label} htmlFor={String(item)}>
                <span
                  className={cls.text}
                  style={{ textTransform: "lowercase" }}
                >
                  {item} {Number(item) > 1 ? t("people") : t("person")}
                </span>
              </label>
            </div>
          ))}
        </div>
      </PopoverContainer>
    </>
  );
}
