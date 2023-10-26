import React from "react";
import cls from "./chatContainer.module.scss";
import useModal from "hooks/useModal";
import Chat from "components/chat/chat";
import RippleButton from "components/chat/rippleButton";
import DrawerContainer from "containers/drawer/drawer";
import { useTranslation } from "react-i18next";
import { useAuth } from "contexts/auth/auth.context";
import { warning } from "components/alert/toast";

type Props = {};

export default function ChatContainer({}: Props) {
  const { t } = useTranslation();
  const [open, handleOpen, handleClose] = useModal();
  const { isAuthenticated } = useAuth();

  function handleOpenChat() {
    if (!isAuthenticated) {
      warning(t("login.first"));
      return;
    }
    handleOpen();
  }

  return (
    <div className={cls.root}>
      <RippleButton handleClick={handleOpenChat} />
      <DrawerContainer
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { padding: 0 } }}
      >
        <Chat />
      </DrawerContainer>
    </div>
  );
}
