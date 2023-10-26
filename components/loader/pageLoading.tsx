import React from "react";
import { CircularProgress } from "@mui/material";
import cls from "./loading.module.scss";

type Props = {};

export default function PageLoading({}: Props) {
  return (
    <div className={cls.pageLoading}>
      <CircularProgress />
    </div>
  );
}
