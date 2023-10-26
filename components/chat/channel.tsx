import React from "react";
import ChatDate from "./chatDate";
import AdminMessage from "./adminMessage";
import UserMessage from "./userMessage";
import { IMessage } from "interfaces";

type IGroupMessage = {
  date: string;
  messages: IMessage[];
};

type Props = {
  groupMessages: IGroupMessage[];
  messageEndRef: any;
};

export default function Channel({ groupMessages, messageEndRef }: Props) {
  return (
    <div className="chat-box">
      {groupMessages.map((item, key) => (
        <div key={key}>
          {item.date !== "Invalid Date" ? <ChatDate date={item.date} /> : ""}
          <div className="sms-box">
            {item.messages.map((item) =>
              Boolean(item.sender) ? (
                <UserMessage
                  key={item.created_at}
                  text={item.chat_content}
                  time={item.created_at}
                  status={item.status}
                  chat_img={item.chat_img}
                />
              ) : (
                <AdminMessage
                  key={item.created_at}
                  text={item.chat_content}
                  time={item.created_at}
                  chat_img={item.chat_img}
                />
              )
            )}
          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
}
