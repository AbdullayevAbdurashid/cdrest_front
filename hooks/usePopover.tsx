import { useState } from "react";

export default function usePopover() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: any) => setAnchorEl(event?.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return [open, anchorEl, handleOpen, handleClose] as const;
}
