import React, { useContext } from "react";
import cls from "./welcome.module.scss";
import { ThemeContext } from "contexts/theme/theme.context";
import { useQuery } from "react-query";
import informationService from "services/information";
import { useSettings } from "contexts/settings/settings.context";
import ErrorBoundary from "containers/errorBoundary/errorBoundary";
import WelcomeHeader from "components/welcomeHeader/welcomeHeader";
import Footer from "containers/layout/footer/footer";

type Props = {
  children: any;
};

export default function WelcomeContainer({ children }: Props) {
  const { isDarkMode } = useContext(ThemeContext);
  const { updateSettings } = useSettings();

  useQuery("settings", () => informationService.getSettings(), {
    onSuccess: (data) => {
      const obj = createSettings(data.data);
      updateSettings({
        payment_type: obj.payment_type,
        instagram_url: obj.instagram,
        facebook_url: obj.facebook,
        twitter_url: obj.twitter,
        referral_active: obj.referral_active,
        otp_expire_time: obj.otp_expire_time,
        customer_app_android: obj.customer_app_android,
        customer_app_ios: obj.customer_app_ios,
        delivery_app_android: obj.delivery_app_android,
        delivery_app_ios: obj.delivery_app_ios,
        vendor_app_android: obj.vendor_app_android,
        vendor_app_ios: obj.vendor_app_ios,
        group_order: obj.group_order,
        footer_text: obj.footer_text,
      });
    },
  });

  function createSettings(list: any[]) {
    const result = list.map((item) => ({
      [item.key]: item.value,
    }));
    return Object.assign({}, ...result);
  }

  return (
    <ErrorBoundary isDarkMode={isDarkMode}>
      <WelcomeHeader />
      <div className={cls.body}>{children}</div>
      <Footer />
    </ErrorBoundary>
  );
}
