import React from "react";
import { Popover, PopoverProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const Wrapper = styled(Popover)(() => ({
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  "& .MuiPaper-root": {
    backgroundColor: "var(--secondary-bg)",
    boxShadow: "var(--popover-box-shadow)",
    borderRadius: "10px",
    maxWidth: "100%",
  },
}));

export default function PopoverContainer({ children, ...rest }: PopoverProps) {
  return (
    <Wrapper
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      // anchorPosition={{ left: 30, top: 30 }}
      {...rest}
    >
      {children}
    </Wrapper>
  );
}
