import React from "react";
import cls from "./content.module.scss";
import { Translation } from "interfaces";

type Props = {
  data?: Translation;
};

export default function Content({ data }: Props) {
  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.header}>
          <h1 className={cls.title}>{data?.title}</h1>
          <p className={cls.text}></p>
        </div>
        <main className={cls.content}>
          <div dangerouslySetInnerHTML={{ __html: data?.description || "" }} />
        </main>
      </div>
    </div>
  );
}
