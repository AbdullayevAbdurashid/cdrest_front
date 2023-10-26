import React from "react";
import { styled } from "@mui/material/styles";
import { TextField, TextFieldProps } from "@mui/material";

const Input = styled(TextField)({
  width: "100%",
  "& .MuiInputLabel-root": {
    fontSize: 16,
    lineHeight: "14px",
    fontWeight: 600,
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
    backgroundColor: "var(--primary-bg)",
    borderRadius: "10px",
    padding: "28px 20px",
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
    display: "none",
  },
  "& .MuiInput-root:hover:not(.Mui-disabled)::before": {
    display: "none",
  },
  "& .MuiInput-root::after": {
    display: "none",
  },
});

export default function TextArea(
  props: TextFieldProps
) {
  return (
    <Input
      variant="standard"
      InputLabelProps={{ shrink: true }}
      {...props}
    />
  );
}
