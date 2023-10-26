import React from "react";
import cls from "./referralContainer.module.scss";
import PrimaryButton from "components/button/primaryButton";
import { useTranslation } from "react-i18next";
import SecondaryButton from "components/button/secondaryButton";
import { useAuth } from "contexts/auth/auth.context";
import Price from "components/price/price";
import { success, error, warning } from "components/alert/toast";
import { Referral } from "interfaces";
import { WEBSITE_URL } from "constants/constants";
import { Grid, Skeleton } from "@mui/material";
import Link from "next/link";
import getImage from "utils/getImage";
import FallbackImage from "components/fallbackImage/fallbackImage";

type Props = {
  data: Referral;
  loading: boolean;
};

export default function ReferralContainer({ data, loading }: Props) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const copyToClipBoard = async () => {
    if (!isAuthenticated) {
      warning(t("login.first"));
      return;
    }
    try {
      await navigator.clipboard.writeText(user?.my_referral || "");
      success(t("copied"));
    } catch (err) {
      error("Failed to copy!");
    }
  };

  const shareReferral = async () => {
    if (!isAuthenticated) {
      warning(t("login.first"));
      return;
    }
    try {
      await navigator.clipboard.writeText(
        WEBSITE_URL + "/register?referral_code=" + user?.my_referral
      );
      success(t("copied"));
    } catch (err) {
      error("Failed to copy!");
    }
  };

  return (
    <div className={cls.container}>
      <div className="container">
        {!loading ? (
          <div className={cls.wrapper}>
            <div className={cls.imgWrapper}>
              <FallbackImage
                src={getImage(data?.img)}
                alt="Referral"
                fill
                sizes="536px"
              />
            </div>
            <div className={cls.main}>
              <div>
                <h1 className={cls.title}>{data?.translation?.title}</h1>
                <p className={cls.text}>
                  {data?.translation?.description}{" "}
                  <Link href="/referral-terms">{t("referral.terms")}</Link>
                </p>
                <div className={cls.line} />
                <div className={cls.flex}>
                  <div className={cls.flexItem}>
                    <span>{t("balance")}: </span>
                    <Price number={user?.referral_from_topup_price} />
                  </div>
                  <div className={cls.flexItem}>
                    <span>{t("referrals")}: </span>
                    <span>{user?.referral_from_topup_count}</span>
                  </div>
                </div>
              </div>
              <div className={cls.actions}>
                <PrimaryButton onClick={shareReferral}>
                  {t("share")}
                </PrimaryButton>
                <SecondaryButton onClick={copyToClipBoard}>
                  {t("copy.code")}
                </SecondaryButton>
              </div>
            </div>
          </div>
        ) : (
          <Grid container spacing={4} py={5}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" className={cls.shimmer} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="text" className={cls.textShimmer} />
              <Skeleton variant="text" className={cls.textShimmer} />
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
}
