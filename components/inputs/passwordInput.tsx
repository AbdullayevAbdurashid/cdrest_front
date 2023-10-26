import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import EyeLineIcon from "remixicon-react/EyeLineIcon";
import EyeOffLineIcon from "remixicon-react/EyeOffLineIcon";

const Input = styled(TextField)({
  width: "100%",
  backgroundColor: "transparent",
  "& .MuiInputLabel-root": {
    fontSize: 12,
    lineHeight: "14px",
    fontWeight: 500,
    textTransform: "uppercase",
    color: "var(--black)",
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

export default function PasswordInput(props: TextFieldProps) {
  const [show, setShow] = useState(false);

  const handleClickShowPassword = () => {
    setShow((state) => !state);
  };

  return (
    <Input
      variant="standard"
      type={show ? "text" : "password"}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword} disableRipple>
              {show ? <EyeOffLineIcon /> : <EyeLineIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
