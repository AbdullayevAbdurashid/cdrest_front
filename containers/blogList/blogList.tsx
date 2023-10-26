import React from "react";
import cls from "./blogList.module.scss";
import { Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { META_TITLE } from "constants/config";
import { IBlog } from "interfaces";
import Link from "next/link";
import getImage from "utils/getImage";
import dayjs from "dayjs";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data: IBlog[];
};

export default function BlogList({ data }: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");

  return (
    <section className="container">
      <div className={cls.container}>
        <div className={cls.header}>
          <h2 className={cls.title}>
            {META_TITLE} {t("blog")}
          </h2>
        </div>
        <Grid container spacing={isDesktop ? 4 : 2}>
          {data.map((item, idx) => (
            <Grid
              key={item.id}
              item
              xs={12}
              md={idx === 0 ? 12 : 6}
              lg={idx === 0 ? 12 : 4}
            >
              <Link
                href={`/blog/${item.uuid}`}
                className={`${cls.card} ${idx === 0 ? cls.horizontal : ""}`}
              >
                <div className={cls.header}>
                  <FallbackImage
                    fill
                    src={getImage(item.img)}
                    alt={item.translation?.title}
                    sizes="321px"
                  />
                </div>
                <div className={cls.wrapper}>
                  <div className={cls.body}>
                    <h3 className={cls.title}>{item.translation?.title}</h3>
                    <p className={cls.text}>{item.translation?.short_desc}</p>
                  </div>
                  <div className={cls.footer}>
                    <p className={cls.text}>
                      {dayjs(item.created_at).format("MMM DD, HH:mm")}
                    </p>
                  </div>
                </div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  );
}
