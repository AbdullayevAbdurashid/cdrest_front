//@ts-nocheck
import React from "react";
import cls from "./socialLogin.module.scss";
import { useTranslation } from "react-i18next";
import AppleFillIcon from "remixicon-react/AppleFillIcon";
import FacebookCircleFillIcon from "remixicon-react/FacebookCircleFillIcon";
import GoogleFillIcon from "remixicon-react/GoogleFillIcon";
import { useAuth } from "contexts/auth/auth.context";
import authService from "services/auth";
import { useRouter } from "next/router";
import { setCookie } from "utils/session";
import nProgress from "nprogress";
import { error } from "components/alert/toast";

type Props = {};

export default function SocialLogin({}: Props) {
  const { t } = useTranslation();
  const { googleSignIn, facebookSignIn, appleSignIn, setUserData } = useAuth();
  const { push, query } = useRouter();
  const referralCode: any = query.referral_code;

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn().then((res) => {
        const body = {
          name: res.user.displayName,
          email: res.user.email,
          id: res.user.uid,
          referral: referralCode || undefined,
        };
        nProgress.start();
        authService
          .loginByGoogle(body)
          .then(({ data }) => {
            const token = data.token_type + " " + data.access_token;
            setCookie("access_token", token);
            setUserData(data.user);
            push("/");
          })
          .catch((err) => error(err?.data?.message))
          .finally(() => nProgress.done());
      });
    } catch (err) {
      error(err.message);
      console.log(err.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn().then((res) => {
        const body = {
          name: res.user.displayName,
          email: res.user.email,
          id: res.user.uid,
          avatar: res.user.photoURL,
          referral: referralCode || undefined,
        };
        nProgress.start();
        authService
          .loginByFacebook(body)
          .then(({ data }) => {
            const token = data.token_type + " " + data.access_token;
            setCookie("access_token", token);
            setUserData(data.user);
            push("/");
          })
          .catch((err) => error(err?.data?.message))
          .finally(() => nProgress.done());
      });
    } catch (err) {
      error(err.message);
      console.log(err.message);
    }
  };

  const handleAppleSignIn = async () => {
    console.log("apple sign in");
    try {
      await appleSignIn().then((res) => {
        console.log("res => ", res);
        const body = {
          name: res.user.displayName,
          email: res.user.email,
          id: res.user.uid,
          referral: referralCode || undefined,
        };
        nProgress.start();
        authService
          .loginByGoogle(body)
          .then(({ data }) => {
            const token = data.token_type + " " + data.access_token;
            setCookie("access_token", token);
            setUserData(data.user);
            push("/");
          })
          .catch((err) => error(err?.data?.message))
          .finally(() => nProgress.done());
      });
    } catch (err) {
      error(err.message);
      console.log(err.message);
    }
  };

  return (
    <div className={cls.wrapper}>
      <div className={cls.row}>
        <div className={cls.line} />
        <div className={cls.title}>{t("access.quickly")}</div>
        <div className={cls.line} />
      </div>
      <div className={cls.flex}>
        <button type="button" className={cls.item} onClick={handleAppleSignIn}>
          <AppleFillIcon />
          <span className={cls.text}>Apple</span>
        </button>
        <button
          type="button"
          className={cls.item}
          onClick={handleFacebookSignIn}
        >
          <FacebookCircleFillIcon />
          <span className={cls.text}>Facebook</span>
        </button>
        <button type="button" className={cls.item} onClick={handleGoogleSignIn}>
          <GoogleFillIcon />
          <span className={cls.text}>Google</span>
        </button>
      </div>
    </div>
  );
}
