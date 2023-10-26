import React from "react";
import cls from "./storyMenu.module.scss";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import useLocale from "hooks/useLocale";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { Story } from "interfaces";
import dayjs from "dayjs";

type Props = {
  handleClose: () => void;
  stories: Story[][];
  handleSelect: (index: number) => void;
};

export default function StoryMenu({
  handleClose,
  stories,
  handleSelect,
}: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.aside}>
      <button type="button" className={cls.closeBtn} onClick={handleClose}>
        <CloseFillIcon />
      </button>
      <h1 className={cls.title}>{t("stories")}</h1>
      <div className={cls.wrapper}>
        <h3 className={cls.title}>{t("all.stories")}</h3>
        {stories.map((item, idx) => (
          <button
            key={item[0].created_at}
            className={cls.flex}
            onClick={() => handleSelect(idx)}
          >
            <div className={cls.logo}>
              <div className={cls.imgWrapper}>
                <FallbackImage
                  src={item[0].logo_img}
                  alt={item[0].product_title}
                />
              </div>
            </div>
            <div className={cls.main}>
              <h3 className={cls.storyTitle}>{item[0].title}</h3>
              <p className={cls.caption}>
                {Math.abs(dayjs(item[0].created_at).diff(new Date(), "hours"))}{" "}
                {t("hours.ago")}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
