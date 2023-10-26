import React, { useEffect, useRef, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import Channel from "./channel";
import {
  addMessage,
  selectChat,
  setCurrentChat,
  setNewMessage,
} from "redux/slices/chat";
import { createChat, sendMessage } from "services/firebase";
import { scrollTo } from "utils/scrollTo";
import { getMessages } from "utils/getMessages";
import { useTranslation } from "react-i18next";
import UploadMedia from "./uploadMedia";
import { SUPPORTED_FORMATS } from "constants/imageFormats";
import { useRouter } from "next/router";
import useModal from "hooks/useModal";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { useAuth } from "contexts/auth/auth.context";
import { IChat, IMessage } from "interfaces";
import { useMediaQuery } from "@mui/material";
import ModalContainer from "containers/modal/modal";
import MobileDrawer from "containers/drawer/mobileDrawer";
import { warning } from "components/alert/toast";

export default function Chat() {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLInputElement>(null);
  const { pathname, query } = useRouter();
  const dispatch = useAppDispatch();
  const [modal, handleOpenModal, handleCloseModal] = useModal();
  const messageEndRef = useRef<HTMLDivElement>();
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const isShop = pathname === "/restaurant/[id]" || pathname === "/shop/[id]";
  const isOrder = pathname === "/orders/[id]";
  const shopId = String(query.id);
  const { chats, currentChat, newMessage, roleId, messages } =
    useAppSelector(selectChat);
  const { user } = useAuth();
  const groupMessages = getMessages({ currentChat, messages });

  const handleChat = (myChat?: IChat) => {
    if (user && chats) {
      if (myChat) {
        dispatch(setCurrentChat(myChat));
      } else {
        createChat({
          shop_id: -1,
          roleId: isShop ? shopId : isOrder ? roleId : "admin",
          user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            img: user?.img || "",
          },
        });
      }
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, currentChat]);

  useEffect(() => {
    const myChat = chats
      .filter((item) => item?.user?.id == user.id)
      .find((item) =>
        isShop
          ? item.roleId == shopId
          : isOrder
          ? item.roleId == roleId
          : item.roleId == "admin"
      );
    handleChat(myChat);
  }, [chats]);

  function handleFile(event: any) {
    if (!SUPPORTED_FORMATS.includes(event.target.files[0].type)) {
      warning("Supported only image formats!");
    } else {
      setFile(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setUrl(String(reader.result));
          handleOpenModal();
        }
      };
      reader?.readAsDataURL(event.target.files[0]);
    }
  }

  const handleOnChange = (value: string) => {
    dispatch(setNewMessage(value));
  };

  const handleOnSubmit = (url: string) => {
    const isFile = url?.includes("https");
    const trimmedMessage = newMessage
      .replace(/\&nbsp;/g, "")
      .replace(/<[^>]+>/g, "")
      .trim();
    const payload = {
      chat_content: trimmedMessage,
      chat_id: currentChat?.id || 0,
      sender: 1,
      unread: true,
      roleId: isShop ? shopId : isOrder ? roleId : "admin",
      created_at: new Date().toString(),
    } as IMessage;

    if (isFile) payload.chat_img = url;
    if (trimmedMessage || isFile) {
      sendMessage(payload);
      dispatch(setNewMessage(""));
      dispatch(addMessage({ ...payload, status: "pending" }));
      const topPosition = messageEndRef.current?.offsetTop || 0;
      const container = document.querySelector(
        ".message-list .scrollbar-container"
      );
      scrollTo(container, topPosition - 30, 600);
      setUrl("");
      handleCloseModal();
    }
  };

  const onAttachClick = () => {
    nextRef.current?.click();
  };

  return (
    <div className="chat-drawer">
      <div className="header">
        <h3 className="title">{t("help.center")}</h3>
      </div>
      <div className="chat-wrapper">
        <input
          type="file"
          ref={nextRef}
          onChange={handleFile}
          accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/svg"
          className="d-none"
        />
        <MainContainer responsive className="chat-container rounded">
          <ChatContainer className="chat-container">
            <MessageList className="message-list">
              <Channel
                groupMessages={groupMessages}
                messageEndRef={messageEndRef}
              />
            </MessageList>
            <MessageInput
              ref={inputRef}
              value={newMessage}
              onChange={handleOnChange}
              onSend={handleOnSubmit}
              placeholder={t("message")}
              className="chat-input"
              attachButton={true}
              onAttachClick={onAttachClick}
            />
          </ChatContainer>
        </MainContainer>
        {isDesktop ? (
          <ModalContainer open={modal} onClose={handleCloseModal}>
            <UploadMedia
              url={url}
              file={file}
              handleOnSubmit={handleOnSubmit}
              handleClose={handleCloseModal}
            />
          </ModalContainer>
        ) : (
          <MobileDrawer open={modal} onClose={handleCloseModal}>
            <UploadMedia
              url={url}
              file={file}
              handleOnSubmit={handleOnSubmit}
              handleClose={handleCloseModal}
            />
          </MobileDrawer>
        )}
      </div>
    </div>
  );
}
