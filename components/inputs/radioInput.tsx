import React from "react";
import { Radio, RadioProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const BpIcon = styled("span")(() => ({
  borderRadius: "50%",
  width: 18,
  height: 18,
  boxShadow: "inset 0 0 0 1px #898989, inset 0 -1px 0 #898989",
  backgroundColor: "transparent",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    // backgroundColor: "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#83ea00",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 18,
    height: 18,
    backgroundImage: "radial-gradient(#232B2F,#232B2F 28%,transparent 32%)",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#83ea00",
  },
});

export default function RadioInput(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}
