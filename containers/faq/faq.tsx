import React from "react";
import cls from "./faq.module.scss";
import { Faq } from "interfaces";
import useLocale from "hooks/useLocale";
import FaqItem from "./faqItem";

type Props = {
  data?: Faq[];
};

export default function FaqContainer({ data }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.container}>
      <div className="welcome-container">
        <section className={cls.wrapper}>
          <h1 className={cls.title}>{t("faq")}</h1>
          <div className={cls.accordion}>
            {data?.map((item) => (
              <FaqItem key={item.id} data={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
