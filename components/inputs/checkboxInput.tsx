import React from "react";
import { CheckboxProps, Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";

const MuiCheckbox = styled(Checkbox)(() => ({
  padding: 0,
  color: "var(--dark-blue)",
  ".MuiSvgIcon-root": {
    fill: "var(--dark-blue)",
  },
}));

export default function CheckboxInput(props: CheckboxProps) {
  return <MuiCheckbox disableRipple {...props} />;
}
