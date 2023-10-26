import React from "react";
import cls from "./blogContent.module.scss";
import { IBlog } from "interfaces";
import dayjs from "dayjs";
import getImage from "utils/getImage";
import FacebookCircleFillIcon from "remixicon-react/FacebookCircleFillIcon";
import TwitterFillIcon from "remixicon-react/TwitterFillIcon";
import LinkedinFillIcon from "remixicon-react/LinkedinFillIcon";
import MailFillIcon from "remixicon-react/MailFillIcon";
import LinksFillIcon from "remixicon-react/LinksFillIcon";
import {
  FacebookShareButton,
  EmailShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { useTranslation } from "react-i18next";
import { success, error } from "components/alert/toast";
import { WEBSITE_URL } from "constants/constants";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data?: IBlog;
};

export default function BlogContent({ data }: Props) {
  const { t } = useTranslation();

  const shareUrl = WEBSITE_URL + "/blog/" + data?.uuid;

  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      success(t("copied"));
    } catch (err) {
      error("Failed to copy!");
    }
  };

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.header}>
          <h1 className={cls.title}>{data?.translation?.title}</h1>
          <p className={cls.muted}>
            {dayjs(data?.created_at).format("MMM DD, HH:mm")}
          </p>
          {/* <p className={cls.text}>{data?.translation?.short_desc}</p> */}
        </div>
        <div className={cls.hero}>
          <FallbackImage
            fill
            src={getImage(data?.img)}
            alt={data?.translation?.title || ""}
            sizes="(max-width: 768px) 600px, 1072px"
          />
        </div>
        <main className={cls.content}>
          <div className={cls.sticky}>
            <div className={cls.share}>
              <FacebookShareButton
                url={shareUrl}
                title={data?.translation?.title}
                className={cls.shareItem}
              >
                <FacebookCircleFillIcon />
              </FacebookShareButton>
              <TwitterShareButton
                url={shareUrl}
                title={data?.translation?.title}
                className={cls.shareItem}
              >
                <TwitterFillIcon />
              </TwitterShareButton>
              <LinkedinShareButton
                url={shareUrl}
                title={data?.translation?.title}
                className={cls.shareItem}
              >
                <LinkedinFillIcon />
              </LinkedinShareButton>
              <EmailShareButton
                url={shareUrl}
                title={data?.translation?.title}
                className={cls.shareItem}
              >
                <MailFillIcon />
              </EmailShareButton>
              <button className={cls.shareItem} onClick={copyToClipBoard}>
                <LinksFillIcon />
              </button>
            </div>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: data?.translation?.description || "",
            }}
          />
        </main>
      </div>
    </div>
  );
}
