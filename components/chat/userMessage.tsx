import React from "react";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import { Message } from "@chatscope/chat-ui-kit-react";
import dayjs from "dayjs";

type Props = {
  text: string;
  time: string;
  status?: string;
  chat_img: string;
};

export default function UserMessage({
  text,
  time,
  status = "",
  chat_img,
}: Props) {
  return (
    <div className="user-sms-wrapper">
      <div className={`user-message ${chat_img && "chat-image"}`}>
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
        <span className="double-check">
          {status === "pending" ? "" : <CheckDoubleLineIcon size={16} />}
        </span>
      </div>
    </div>
  );
}
