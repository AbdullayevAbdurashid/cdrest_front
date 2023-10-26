import React from "react";
import cls from "./shopShare.module.scss";
import ShareLineIcon from "remixicon-react/ShareLineIcon";
import axios from "axios";
import {
  DYNAMIC_LINK_ANDROID,
  DYNAMIC_LINK_DOMAIN,
  DYNAMIC_LINK_IOS,
  DYNAMIC_LINK_WEB_KEY,
} from "constants/config";
import { IShop } from "interfaces";
import { WEBSITE_URL } from "constants/constants";
import { success, error } from "components/alert/toast";
import { useTranslation } from "react-i18next";
import getBrowserName from "utils/getBrowserName";
import { useMediaQuery } from "@mui/material";

type Props = {
  data?: IShop;
};

export default function ShopShare({ data }: Props) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:820px)");

  function generateShareLink() {
    const shopLink = `${WEBSITE_URL}/shop/${data?.id}`;
    const payload = {
      dynamicLinkInfo: {
        domainUriPrefix: DYNAMIC_LINK_DOMAIN,
        link: shopLink,
        androidInfo: {
          androidPackageName: DYNAMIC_LINK_ANDROID,
          androidFallbackLink: shopLink,
        },
        iosInfo: {
          iosBundleId: DYNAMIC_LINK_IOS,
          iosFallbackLink: shopLink,
        },
        socialMetaTagInfo: {
          socialTitle: data?.translation?.title,
          socialDescription: data?.translation?.description,
          socialImageLink: data?.logo_img,
        },
      },
    };
    const browser = getBrowserName();
    if (browser === "Safari" || (browser === "Google Chrome" && isMobile)) {
      copyToClipBoardSafari(payload);
    } else {
      copyToClipBoard(payload);
    }
  }

  function copyToClipBoardSafari(payload: any) {
    const clipboardItem = new ClipboardItem({
      "text/plain": axios
        .post(
          `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${DYNAMIC_LINK_WEB_KEY}`,
          payload
        )
        .then((result) => {
          if (!result) {
            return new Promise(async (resolve) => {
              error("Failed to generate link!");
              //@ts-expect-error
              resolve(new Blob[""]());
            });
          }

          const copyText = result.data.shortLink;
          return new Promise(async (resolve) => {
            success(t("copied"));
            resolve(new Blob([copyText]));
          });
        }),
    });
    navigator.clipboard.write([clipboardItem]);
  }

  async function copyToClipBoard(payload: any) {
    axios
      .post(
        `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${DYNAMIC_LINK_WEB_KEY}`,
        payload
      )
      .then((result) => {
        const copyText = result.data.shortLink;
        copy(copyText);
      })
      .catch((err) => {
        error("Failed to generate link!");
        console.log("generate link failed => ", err);
      });
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      success(t("copied"));
    } catch (err) {
      error("Failed to copy!");
      console.log("copy failed => ", err);
    }
  }

  return (
    <button className={cls.shareBtn} onClick={generateShareLink}>
      <ShareLineIcon />
    </button>
  );
}
