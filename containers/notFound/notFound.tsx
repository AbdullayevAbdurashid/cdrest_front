import React from "react";
import cls from "./notFound.module.scss";
import DarkButton from "components/button/darkButton";
import Image from "next/image";
import { useRouter } from "next/router";

type Props = {};

export default function NotFound({}: Props) {
  const { push } = useRouter();

  return (
    <div className={cls.wrapper}>
      <div className={cls.hero}>
        <Image src="/images/404.png" alt="Page not found" fill />
      </div>
      <div className={cls.body}>
        <h1>Oops, page not found!</h1>
        <DarkButton type="button" onClick={() => push("/")}>
          Go to home
        </DarkButton>
      </div>
    </div>
  );
}
