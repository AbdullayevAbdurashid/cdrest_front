import React from "react";
import cls from "./supportCard.module.scss";
import CustomerService2FillIcon from "remixicon-react/CustomerService2FillIcon";
import { useTranslation } from "react-i18next";
import DarkButton from "components/button/darkButton";
import dynamic from "next/dynamic";
import Chat from "components/chat/chat";
import useModal from "hooks/useModal";
import Message3LineIcon from "remixicon-react/Message3LineIcon";
import { useAuth } from "contexts/auth/auth.context";
import { warning } from "components/alert/toast";

const DrawerContainer = dynamic(() => import("containers/drawer/drawer"));

type Props = {};

export default function SupportCard({}: Props) {
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
    <div className={cls.wrapper}>
      <div className={cls.flex}>
        <div className={cls.iconWrapper}>
          <CustomerService2FillIcon />
        </div>
        <div className={cls.naming}>
          <h5 className={cls.title}>{t("have.questions")}</h5>
          <p className={cls.text}>{t("questions.text")}</p>
        </div>
      </div>
      <DarkButton onClick={handleOpenChat} icon={<Message3LineIcon />}>
        {t("help.center")}
      </DarkButton>

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
