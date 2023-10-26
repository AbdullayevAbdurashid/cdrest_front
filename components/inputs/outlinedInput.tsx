import React from "react";
import cls from "./inputs.module.scss";
import { styled } from "@mui/material/styles";
import { TextField, TextFieldProps } from "@mui/material";

const Input = styled(TextField)({
  width: "100%",
  backgroundColor: "transparent",
  "& .MuiOutlinedInput-root": {
    height: 48,
    borderRadius: 8,
    transition: "all .2s",
    color: "var(--dark-blue)",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline":
      {
        transition: "all .2s",
        borderColor: "var(--dark-blue)",
        borderWidth: 1,
      },
    "& .MuiOutlinedInput-input": {
      padding: "0 16px",
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        appearance: "none",
        WebkitAppearance: "none",
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: 12,
    lineHeight: "14px",
    fontWeight: 500,
    textTransform: "uppercase",
    color: "var(--dark-blue)",
    "&.Mui-error": {
      color: "var(--red)",
    },
  },
});

export default function OutlinedInput(props: TextFieldProps) {
  return (
    <div className={cls.container}>
      {!!props.label && <h4 className={cls.title}>{props.label}</h4>}
      <Input
        {...props}
        label={undefined}
        onWheel={(e: any) => e.target.blur()}
      />
    </div>
  );
}
