import React from "react";
import cls from "./welcomeBlog.module.scss";
import { Grid } from "@mui/material";
import { IBlog } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";
import InstagramLineIcon from "remixicon-react/InstagramLineIcon";
import ArrowRightLineIcon from "remixicon-react/ArrowRightLineIcon";
import useLocale from "hooks/useLocale";
import { useSettings } from "contexts/settings/settings.context";
import Link from "next/link";

type Props = {
  data?: IBlog;
};

export default function WelcomeBlog({ data }: Props) {
  const { t } = useLocale();
  const { settings } = useSettings();

  if (data) {
    return (
      <div className={cls.container}>
        <div className="welcome-container">
          <div className={cls.wrapper}>
            <div className={cls.header}>
              <h3 className={cls.heading}>{t("latest.blog")}</h3>
              <Link href="/blog" className={cls.link}>
                <span className={cls.text}>{t("see.all")}</span>
                <ArrowRightLineIcon />
              </Link>
            </div>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <div className={cls.card}>
                  <h3 className={cls.title}>{data?.translation?.title}</h3>
                  <div
                    className={cls.body}
                    dangerouslySetInnerHTML={{
                      __html:
                        data?.translation?.description &&
                        data?.translation?.description.length > 499
                          ? `${data?.translation?.description.slice(0, 500)}...`
                          : data?.translation?.description || "",
                    }}
                  />
                  <Link className={cls.link} href={`/blog/${data?.uuid}`}>
                    {t("read.more")}
                  </Link>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className={cls.imgWrapper}>
                  <FallbackImage
                    src={data?.img}
                    alt={data?.translation?.title}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <a
                  href={settings?.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls.socialCard}
                >
                  <InstagramLineIcon />
                  <div className={cls.label}>
                    <span className={cls.text}>{t("view.our.insta")}</span>
                    <ArrowRightLineIcon />
                  </div>
                </a>
              </Grid>
              <Grid item xs={12} md={8}>
                <div className={cls.card}>
                  <div className={cls.badge}>
                    <span className={cls.text}>{t("ads")}</span>
                  </div>
                  <h3 className={cls.title}>Broccoli Bacon Salad</h3>
                  <div className={`${cls.body} ${cls.small}`}>
                    This easy chicken and broccoli casserole is <br /> a quick
                    one-skillet dinner fix that&apos;s a guaranteed <br /> crowd
                    pleaser.
                  </div>
                  <div className={cls.float}>
                    <FallbackImage
                      src="/images/broccoli.png"
                      alt="Broccoli Bacon Salad"
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
