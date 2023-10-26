import React from "react";
import { IShop } from "interfaces";
import cls from "./v4.module.scss";
import { Grid, Skeleton, useMediaQuery } from "@mui/material";
import ShopCard from "components/shopCard/v4";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type Props = {
  shops?: IShop[];
  loading?: boolean;
  title?: string;
  link?: string;
};

export default function ShopList({ shops, loading, title, link }: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { t } = useTranslation();

  return (
    <section
      className="container"
      style={{
        display: !loading && shops?.length === 0 ? "none" : "block",
      }}
    >
      <div className={cls.container}>
        {!!title && (
          <div className={cls.header}>
            <h2 className={cls.title}>{title}</h2>
            {!!link && !loading && (
              <Link className={cls.link} href={link}>
                {t("see.all")}
              </Link>
            )}
          </div>
        )}
        <Grid container spacing={isDesktop ? 4 : 2}>
          {!loading
            ? shops?.map((item) => (
                <Grid key={item.id} item xs={12} sm={6} lg={3}>
                  <ShopCard data={item} />
                </Grid>
              ))
            : Array.from(new Array(4)).map((item, idx) => (
                <Grid key={"shops" + idx} item xs={12} sm={6} lg={3}>
                  <Skeleton variant="rectangular" className={cls.shimmer} />
                </Grid>
              ))}
        </Grid>
      </div>
    </section>
  );
}
