import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

type Props = {
  date: string;
};

export default function ChatDate({ date }: Props) {
  const { t } = useTranslation();
  const isCurrentDay = dayjs(date).isSame(dayjs(), "day");

  return (
    <div
      className="chat-date"
      data-date={isCurrentDay ? t("today") : dayjs(date).format("D MMM")}
    />
  );
}
