import React from "react";
import cls from "./productShare.module.scss";
import ShareLineIcon from "remixicon-react/ShareLineIcon";
import axios from "axios";
import {
  API_KEY,
  DYNAMIC_LINK_ANDROID,
  DYNAMIC_LINK_DOMAIN,
  DYNAMIC_LINK_IOS,
} from "constants/config";
import { Product } from "interfaces";
import { WEBSITE_URL } from "constants/constants";
import { success, error } from "components/alert/toast";
import { useTranslation } from "react-i18next";
import useShopType from "hooks/useShopType";
import getBrowserName from "utils/getBrowserName";
import { useMediaQuery } from "@mui/material";

type Props = {
  data: Partial<Product>;
};

export default function ProductShare({ data }: Props) {
  const { t } = useTranslation();
  const type = useShopType();
  const isMobile = useMediaQuery("(max-width:820px)");

  function generateShareLink() {
    const productLink = `${WEBSITE_URL}/${type}/${data.shop_id}?product=${data.uuid}`;
    const payload = {
      dynamicLinkInfo: {
        domainUriPrefix: DYNAMIC_LINK_DOMAIN,
        link: productLink,
        androidInfo: {
          androidPackageName: DYNAMIC_LINK_ANDROID,
          androidFallbackLink: productLink,
        },
        iosInfo: {
          iosBundleId: DYNAMIC_LINK_IOS,
          iosFallbackLink: productLink,
        },
        socialMetaTagInfo: {
          socialTitle: data?.translation?.title,
          socialDescription: data?.translation?.description,
          socialImageLink: data.img,
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
          `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`,
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
        `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`,
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
