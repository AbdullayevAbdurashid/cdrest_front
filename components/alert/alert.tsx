import React from "react";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import cls from "./alert.module.scss";

type Props = {
  icon: React.ReactElement;
  message: string;
  closeToast?: () => void;
  type: "success" | "warning" | "error" | "info";
};

export default function Alert({ icon, message, closeToast, type }: Props) {
  return (
    <div className={`${cls.root} ${cls[type]}`}>
      <span className={cls.icon}>{icon}</span>
      <div className={cls.layout}>
        <span className={cls.message}>{message}</span>
      </div>
      <button type="button" onClick={closeToast}>
        <CloseFillIcon />
      </button>
    </div>
  );
}
