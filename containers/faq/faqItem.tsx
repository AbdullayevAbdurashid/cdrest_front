import React, { useState } from "react";
import cls from "./faq.module.scss";
import { Faq } from "interfaces";
import AddLineIcon from "remixicon-react/AddLineIcon";

type Props = {
  data: Faq;
};

export default function FaqItem({ data }: Props) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className={`${cls.item} ${isOpen ? cls.active : ""}`}>
      <div className={cls.header} onClick={() => setOpen(!isOpen)}>
        <p className={cls.label}>{data.translation?.question}</p>
        <AddLineIcon />
      </div>
      <div className={cls.body}>{data.translation?.answer}</div>
    </div>
  );
}
