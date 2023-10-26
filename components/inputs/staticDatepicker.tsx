import React from "react";
import { styled } from "@mui/material/styles";
import { DateView, StaticDatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

const StaticDateInput = styled(StaticDatePicker)({
  "& .MuiPickersDay-root": {
    fontFamily: "'Inter', sans-serif",
    "&:hover": {
      backgroundColor: "var(--primary-transparent)",
    },
    "&.Mui-selected": {
      backgroundColor: "var(--primary)",
      color: "var(--dark-blue)",
      "&:hover": {
        backgroundColor: "var(--primary)",
      },
    },
    "&.MuiPickersDay-today": {
      border: "1px solid var(--dark-blue)",
    },
  },
});

type Props = {
  value?: Dayjs;
  onChange: (event: unknown) => void;
  displayStaticWrapperAs?: "desktop" | "mobile";
  openTo?: DateView;
  disablePast?: boolean;
};

export default function StaticDatepicker({
  value,
  onChange,
  displayStaticWrapperAs = "desktop",
  openTo = "day",
  disablePast = true,
}: Props) {
  return (
    <StaticDateInput
      displayStaticWrapperAs={displayStaticWrapperAs}
      openTo={openTo}
      value={value}
      onChange={onChange}
      disablePast={disablePast}
    />
  );
}
