import React from "react";
import { Box, SwipeableDrawer } from "@mui/material";
import { styled } from "@mui/material/styles";
import cls from "./drawer.module.scss";

const Wrapper = styled(SwipeableDrawer)(() => ({
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  "& .MuiPaper-root": {
    backgroundColor: "var(--secondary-bg)",
    boxShadow: "var(--popover-box-shadow)",
    maxWidth: "100%",
    padding: "15px",
    borderRadius: "15px 15px 0 0",
  },
}));
const Puller = styled(Box)(() => ({
  width: 30,
  height: 6,
  backgroundColor: "var(--grey)",
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

type Props = {
  anchor?: "bottom" | "left" | "right" | "top";
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  children: any;
  title?: string;
};

export default function MobileDrawer({
  anchor = "bottom",
  open,
  onClose,
  onOpen = () => {},
  children,
  title,
}: Props) {
  return (
    <Wrapper anchor={anchor} open={open} onClose={onClose} onOpen={onOpen}>
      <Puller />
      {title ? <h1 className={cls.title}>{title}</h1> : ""}
      {children}
    </Wrapper>
  );
}
