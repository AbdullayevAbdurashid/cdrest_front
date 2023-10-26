import React from "react";
import cls from "./modal.module.scss";
import { Dialog, DialogProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseFillIcon from "remixicon-react/CloseFillIcon";

const Wrapper = styled(Dialog)(() => ({
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  "& .MuiPaper-root": {
    backgroundColor: "var(--secondary-bg)",
    boxShadow: "var(--popover-box-shadow)",
    borderRadius: "10px",
    maxWidth: "100%",
  },
  "& .MuiPaper-root.MuiDialog-paperFullScreen": {
    borderRadius: 0,
  },
}));

interface Props extends DialogProps {
  closable?: boolean;
  position?: "right" | "left" | "center";
}

export default function ModalContainer({
  open,
  onClose,
  children,
  fullScreen,
  closable = true,
  position = "center",
}: Props) {
  return (
    <Wrapper
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      className={cls[position]}
    >
      {closable && (
        <button
          className={cls.closeBtn}
          onClick={() => {
            if (onClose) onClose({}, "backdropClick");
          }}
        >
          <CloseFillIcon />
        </button>
      )}
      {children}
    </Wrapper>
  );
}
