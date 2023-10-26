import React from "react";
import { styled } from "@mui/material/styles";
import { Switch, SwitchProps } from "@mui/material";

const IOSSwitch = styled(Switch)({
  width: 60,
  height: 30,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: "5px 7px",
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(26px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#83EA00",
        opacity: 1,
        border: "0.8px solid #76D003 !important",
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: "#E7E7E7",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    position: "relative",
    width: 20,
    height: 20,
    backgroundColor: "var(--secondary-bg)",
    boxShadow: "0px 2px 2px rgba(66, 113, 6, 0.4)",
    "&::after": {
      content: "''",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 2,
      height: 6,
      borderRadius: 100,
      backgroundColor: "var(--grey)",
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 54,
    backgroundColor: "var(--border)",
    opacity: 1,
    transition: "background-color 0.5s",
    border: "0 !important",
  },
});

export default function SwitchInput(props: SwitchProps) {
  return <IOSSwitch {...props} disableRipple />;
}
