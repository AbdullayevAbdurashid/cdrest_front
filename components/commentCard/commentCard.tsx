/* eslint-disable @next/next/no-img-element */
import React from "react";
import cls from "./commentCard.module.scss";
import { Rating } from "@mui/material";
import { ShopReview } from "interfaces";
import dayjs from "dayjs";
import Avatar from "components/avatar";

type Props = {
  data: ShopReview;
};

export default function CommentCard({ data }: Props) {
  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <div className={cls.imgWrapper}>
          {!!data.user && <Avatar data={data.user} />}
        </div>
        <div className={cls.info}>
          <h3 className={cls.username}>
            {data.user?.firstname} {data.user?.lastname}
          </h3>
          <div className={cls.rating}>
            <Rating
              value={data.rating}
              readOnly
              sx={{ color: "#ffa100", "& *": { color: "inherit" } }}
            />
            <div className={cls.muted}>
              {dayjs(data.created_at).format("DD.MM.YYYY")}
            </div>
          </div>
        </div>
      </div>
      <div className={cls.body}>
        <div className={cls.content}>
          <p>{data.comment}</p>
        </div>
      </div>
    </div>
  );
}
