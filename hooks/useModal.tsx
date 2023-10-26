import { useState } from "react";

export default function useModal(isOpen: boolean = false) {
  const [open, setOpen] = useState(isOpen);

  const handleOpen = (event?: any) => {
    event?.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return [open, handleOpen, handleClose] as const;
}
