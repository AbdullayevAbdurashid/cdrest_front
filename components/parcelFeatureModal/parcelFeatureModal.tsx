import React from "react";
import { Dialog, DialogProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const Wrapper = styled(Dialog)(() => ({
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    transform: "translate3d(0, 0, 0)",
    backdropFilter: "blur(25px)"
  },
  "& .MuiPaper-root": {
    backgroundColor: "var(--secondary-bg)",
    boxShadow: "none",
    borderRadius: "10px",
    maxWidth: "100%",
    overflow: "visible",
    "@media (max-width: 576px)": {
      margin: 0,
      maxHeight: "100%",
      borderRadius: 0,
    },
  },
  "& .MuiPaper-root.MuiDialog-paperFullScreen": {
    borderRadius: 0,
  },
}));

export default function FeatureModal({
  open,
  onClose,
  children,
  fullScreen,
}: DialogProps) {
  return (
    <Wrapper open={open} onClose={onClose} fullScreen={fullScreen}>
      {children}
    </Wrapper>
  );
}