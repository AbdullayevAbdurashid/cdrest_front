/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./empty.module.scss";
import PrimaryButton from "components/button/primaryButton";
import { useRouter } from "next/router";

type Props = {
  text: string;
  buttonText?: string;
  link?: string;
};

export default function Empty({ text, buttonText, link = "/" }: Props) {
  const { push } = useRouter();

  return (
    <div className="container">
      <div className={cls.wrapper}>
        <img src="/images/delivery.webp" alt="Empty" />
        <p className={cls.text}>{text}</p>
        {!!buttonText && (
          <div className={cls.actions}>
            <PrimaryButton onClick={() => push(link)}>
              {buttonText}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
