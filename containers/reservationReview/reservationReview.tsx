import React from "react";
import cls from "./reservationReview.module.scss";
import useLocale from "hooks/useLocale";
import { ShopReview } from "interfaces";
import { Grid, useMediaQuery } from "@mui/material";
import CommentCard from "components/commentCard/commentCard";

type Props = {
  data?: ShopReview[];
};

export default function ReservationReview({ data = [] }: Props) {
  const { t } = useLocale();
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <div
      className={`container ${cls.container}`}
      style={{ display: !!data.length ? "block" : "none" }}
    >
      <div className={cls.wrapper}>
        <h1 className={cls.title}>{t("what.people.saying")}</h1>
        <Grid container spacing={isDesktop ? 4 : 2} mt={1}>
          {data.map((item) => (
            <Grid key={item.id} item xs={12} sm={6}>
              <CommentCard data={item} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
