import React from "react";
import { CircularProgress } from "@mui/material";
import cls from "./loading.module.scss";

type Props = {};

export default function Loading({}: Props) {
  return (
    <div className={cls.loading}>
      <CircularProgress />
    </div>
  );
}
