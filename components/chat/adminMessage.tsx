import React from "react";
import dayjs from "dayjs";
import { Message } from "@chatscope/chat-ui-kit-react";

type Props = {
  text: string;
  time: string;
  chat_img: string;
};

export default function AdminMessage({ text, time, chat_img }: Props) {
  return (
    <div className="admin-message-wrapper">
      <div className={`admin-message ${chat_img && "chat-image"}`}>
        {chat_img && (
          <Message
            type="image"
            model={{
              position: "normal",
              direction: "incoming",
              payload: {
                src: chat_img,
                alt: "Joe avatar",
                width: "100%",
                height: "100%",
              },
            }}
          />
        )}
        {text && <div className="text">{text}</div>}
        <div className="time">{dayjs(new Date(time)).format("HH:mm")}</div>
      </div>
    </div>
  );
}
