import React from "react";
import { Grid, useMediaQuery } from "@mui/material";
import { Faq } from "interfaces";
import { useTranslation } from "react-i18next";
import cls from "./help.module.scss";

type Props = {
  data: Faq[];
  children: any;
};

export default function HelpContainer({ data, children }: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <section className={cls.root}>
      <div className="container">
        <div className={cls.wrapper}>
          <h1 className={cls.title}>{t("help")}</h1>
          <Grid container spacing={isDesktop ? 4 : 2}>
            {data.map((item) => (
              <Grid key={item.id} item xs={12} md={6} lg={4}>
                <h4 className={cls.boldText}>{item.translation?.question}</h4>
                <p className={cls.text}>{item.translation?.answer}</p>
              </Grid>
            ))}
          </Grid>
          <div className={cls.help}>{children}</div>
        </div>
      </div>
    </section>
  );
}
