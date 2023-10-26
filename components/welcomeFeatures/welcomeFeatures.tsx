import React from "react";
import cls from "./welcomeFeatures.module.scss";
import { Grid, useMediaQuery } from "@mui/material";
import Link from "next/link";
import FallbackImage from "components/fallbackImage/fallbackImage";
import getImage from "utils/getImage";
import useLocale from "hooks/useLocale";

type Props = {};

export default function WelcomeFeatures({}: Props) {
  const { t } = useLocale();
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <div className={`container ${cls.container}`}>
      <div className={cls.wrapper}>
        <h2 className={cls.title}>{t("welcome.features.title")}</h2>
        <Grid container spacing={isDesktop ? 4 : 2}>
          <Grid item xs={12} md={6} lg={4}>
            <Link href="/be-seller" className={cls.card}>
              <div className={cls.header}>
                <FallbackImage
                  fill
                  src={getImage("./images/restaurant.jpg")}
                  alt="Welcome"
                  sizes="321px"
                />
              </div>
              <div className={cls.body}>
                <h3 className={cls.title}>{t("do.you.have.restaurant")}</h3>
                <p className={cls.text}>{t("add.your.restaurant")}</p>
              </div>
            </Link>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Link href="/deliver" className={cls.card}>
              <div className={cls.header}>
                <FallbackImage
                  fill
                  src={getImage("./images/welcome.jpg")}
                  alt="Welcome"
                  sizes="321px"
                />
              </div>
              <div className={cls.body}>
                <h3 className={cls.title}>{t("deliver.title")}</h3>
                <p className={cls.text}>{t("sign.up.to.deliver")}</p>
              </div>
            </Link>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <div className={cls.card}>
              <div className={cls.header}>
                <div className={cls.ad}>{t("place.for.ad")}</div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
