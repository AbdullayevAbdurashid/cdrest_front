import React from "react";
import {
  FormControl,
  InputLabel,
  NativeSelect,
  NativeSelectProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import { useTranslation } from "react-i18next";

const Select = styled(FormControl)({
  width: "100%",
  backgroundColor: "transparent",
  "& .MuiInputLabel-root": {
    fontSize: 12,
    lineHeight: "14px",
    fontWeight: 500,
    textTransform: "uppercase",
    color: "var(--black)",
    fontFamily: "'Inter', sans-serif",
    transform: "none",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--black)",
  },
  "& .MuiInput-root": {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: "19px",
    color: "var(--black)",
    fontFamily: "'Inter', sans-serif",
  },
  "& .MuiInput-root::before": {
    borderBottom: "1px solid var(--grey)",
  },
  "& .MuiInput-root:hover:not(.Mui-disabled)::before": {
    borderBottom: "2px solid var(--black)",
  },
  "& .MuiInput-root::after": {
    borderBottom: "2px solid var(--primary)",
  },
  "& .MuiNativeSelect-icon": {
    width: 16,
    height: 16,
  },
  "& .MuiNativeSelect-select option:disabled": {
    color: "var(--secondary-text)",
    fontWeight: 400,
  },
});

type Option = {
  label: string;
  value: string;
};

interface Props extends NativeSelectProps {
  options: Option[];
  label: string;
}

export default function SelectInput({
  label,
  name,
  onChange,
  value,
  options,
  placeholder,
}: Props) {
  const { t } = useTranslation();

  return (
    <Select fullWidth>
      <InputLabel variant="standard" htmlFor={name} shrink={true}>
        {label}
      </InputLabel>
      <NativeSelect
        value={value}
        inputProps={{
          name: name,
          id: name,
        }}
        onChange={onChange}
        IconComponent={ArrowDownSLineIcon}
        placeholder={placeholder}
      >
        <option value="" disabled hidden>
          {t("choose.here")}
        </option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {t(item.label)}
          </option>
        ))}
      </NativeSelect>
    </Select>
  );
}
