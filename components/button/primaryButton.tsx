import React from "react";
import { CircularProgress } from "@mui/material";
import cls from "./button.module.scss";

type ButtonType = "button" | "submit";
type ButtonSize = "small" | "medium" | "large";

type Props = {
  children: any;
  disabled?: boolean;
  onClick?: () => void;
  type?: ButtonType;
  icon?: React.ReactElement;
  loading?: boolean;
  size?: ButtonSize;
  id?: string;
};

export default function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
  icon,
  loading = false,
  size = "medium",
  id,
}: Props) {
  return (
    <button
      id={id}
      type={type}
      className={`${cls.primaryBtn} ${cls[size]} ${
        disabled ? cls.disabled : ""
      }`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {!loading ? (
        <>
          {icon ? icon : ""}
          <span className={cls.text}>{children}</span>
        </>
      ) : (
        <CircularProgress size={22} />
      )}
    </button>
  );
}
