import React from "react";
import { CircularProgress } from "@mui/material";

type Props = {
  size?: number;
};

export default function Loader({ size }: Props) {
  return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <CircularProgress size={size} />
    </div>
  );
}
