import React from "react";
import { styled } from "@mui/material/styles";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  useMediaQuery,
} from "@mui/material";
import EditLineIcon from "remixicon-react/EditLineIcon";
import useModal from "hooks/useModal";
import EditPhone from "components/editPhone/editPhone";
import dynamic from "next/dynamic";

const ModalContainer = dynamic(() => import("containers/modal/modal"));
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));

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

export default function PhoneInputWithVerification(props: TextFieldProps) {
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const [phoneModal, handleOpenPhone, handleClosePhone] = useModal();

  return (
    <>
      <Input
        variant="standard"
        type="text"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpenPhone} disableRipple>
                <EditLineIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
      {isDesktop ? (
        <ModalContainer open={phoneModal} onClose={handleClosePhone}>
          <EditPhone handleClose={handleClosePhone} />
        </ModalContainer>
      ) : (
        <MobileDrawer open={phoneModal} onClose={handleClosePhone}>
          <EditPhone handleClose={handleClosePhone} />
        </MobileDrawer>
      )}
    </>
  );
}
