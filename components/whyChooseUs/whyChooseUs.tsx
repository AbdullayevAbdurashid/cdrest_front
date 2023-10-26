import React from "react";
import cls from "./whyChooseUs.module.scss";
import useLocale from "hooks/useLocale";
import { ILandingPageData } from "interfaces/page.interface";

type Props = {
  data?: ILandingPageData;
};

export default function WhyChooseUs({ data }: Props) {
  const { t, locale } = useLocale();

  return (
    <div className={cls.container}>
      <div className="welcome-container">
        <section className={cls.wrapper}>
          {!!data?.features.length && (
            <h1 className={cls.title}>{t("why.choose.us")}</h1>
          )}
          <div className={cls.flex}>
            {data?.features.map((item, idx) => (
              <div key={idx} className={cls.card} tabIndex={idx + 1}>
                <div className={cls.number}>0{idx + 1}</div>
                <h3 className={cls.cardTitle}>{item.title[locale]}</h3>
                <p className={cls.text}>{item.description[locale]}</p>
                <video loop muted autoPlay>
                  <source src={item.img} />
                </video>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
