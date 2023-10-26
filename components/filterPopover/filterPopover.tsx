import React from "react";
import { PopoverProps } from "@mui/material";
import PopoverContainer from "containers/popover/popover";

export default function FilterPopover(props: PopoverProps) {
  return (
    <PopoverContainer
      {...props}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    ></PopoverContainer>
  );
}
