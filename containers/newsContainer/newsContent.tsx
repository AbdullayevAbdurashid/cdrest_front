import React from "react";
import cls from "./newsContainer.module.scss";
import { IBlog } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";
import SecondaryButton from "components/button/secondaryButton";
import useLocale from "hooks/useLocale";
import Loading from "components/loader/loading";

type Props = {
  data?: IBlog;
  loading?: boolean;
  handleClose: () => void;
};

export default function NewsContent({ data, loading, handleClose }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.wrapper}>
      <div className={cls.imgWrapper}>
        <FallbackImage src={data?.img} alt={data?.translation?.title} />
      </div>
      <div className={cls.header}>
        <h1 className={cls.title}>{data?.translation?.title}</h1>
        <p className={cls.caption}>{data?.translation?.short_desc}</p>
      </div>
      <div className={cls.body}>
        <div
          dangerouslySetInnerHTML={{
            __html: data?.translation?.description || "",
          }}
        />
      </div>
      <div className={cls.footer}>
        <div className={cls.actions}>
          <SecondaryButton onClick={handleClose}>{t("cancel")}</SecondaryButton>
        </div>
      </div>
      {!!loading && <Loading />}
    </div>
  );
}
