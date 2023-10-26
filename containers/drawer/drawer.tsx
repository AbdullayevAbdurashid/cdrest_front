import React from "react";
import { Drawer, DrawerProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import cls from "./drawer.module.scss";
import CloseFillIcon from "remixicon-react/CloseFillIcon";

const Wrapper = styled(Drawer)(() => ({
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  "& .MuiPaper-root": {
    backgroundColor: "var(--secondary-bg)",
    boxShadow: "var(--popover-box-shadow)",
    maxWidth: "450px",
    padding: "40px",
    "@media (max-width: 576px)": {
      minWidth: "100vw",
      maxWidth: "100vw",
      padding: "15px",
    },
  },
}));

export default function DrawerContainer({
  anchor = "right",
  open,
  onClose,
  children,
  title,
  sx,
  PaperProps,
}: DrawerProps) {
  return (
    <Wrapper
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={sx}
      PaperProps={PaperProps}
    >
      {title ? <h1 className={cls.title}>{title}</h1> : ""}
      <button
        type="button"
        className={cls.closeBtn}
        onClick={() => {
          if (onClose) onClose({}, "backdropClick");
        }}
      >
        <CloseFillIcon />
      </button>
      {children}
    </Wrapper>
  );
}
