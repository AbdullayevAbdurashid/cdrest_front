import React from "react";
import { styled } from "@mui/material/styles";
import { TextField, TextFieldProps } from "@mui/material";

const Input = styled(TextField)({
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
    "&.Mui-error": {
      color: "var(--red)",
    },
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
    "&.Mui-error::after": {
      borderBottomColor: "var(--red)",
    },
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
});

export default function TextInput(props: TextFieldProps) {
  return (
    <Input variant="standard" InputLabelProps={{ shrink: true }} {...props} />
  );
}
