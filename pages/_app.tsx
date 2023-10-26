import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "../styles/globals.css";
import "../styles/_chat.scss";
import { useEffect, useState } from "react";
import App, { AppProps } from "next/app";
import Layout from "containers/layout/layout";
import { ToastContainer } from "react-toastify";
import { Router, useRouter } from "next/router";
import { getCookie, setCookie } from "utils/session";
import MainContainer from "containers/main/mainContainer";
import ThemeProvider from "contexts/theme/theme.provider";
import {
  createEmotionCache,
  createRtlEmotionCache,
} from "utils/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import MuiThemeProvider from "contexts/muiTheme/muiTheme.provider";
import { useDeviceType } from "utils/useDeviceType";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "contexts/auth/auth.provider";
import { SettingsProvider } from "contexts/settings/settings.provider";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { store, persistor } from "redux/store";
import { PersistGate } from "redux-persist/integration/react";
import i18n from "../i18n";
import getLanguage from "utils/getLanguage";
import { config } from "constants/reactQuery.config";
import Script from "next/script";
import { G_TAG } from "constants/constants";

import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "nprogress/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const clientSideEmotionCache = createEmotionCache();
const clientSideRtlEmotionCache = createRtlEmotionCache();
const pagesWithoutLayout = [
  "register",
  "login",
  "reset-password",
  "verify-phone",
  "update-password",
  "update-details",
  "welcome",
];

const uiTypes = ['1', '2', '3', '4']

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  userAgent: string;
  appTheme: "light" | "dark";
  authState: any;
  settingsState: any;
  defaultAddress: string;
  locale: string;
  translations?: any;
  appDirection: "ltr" | "rtl";
  uiType: string
}

export default function ExtendedApp({
  Component,
  pageProps,
  userAgent,
  appTheme,
  emotionCache,
  authState,
  settingsState,
  defaultAddress,
  locale,
  appDirection,
  uiType
}: MyAppProps) {
  NProgress.configure({ showSpinner: false });
  const { pathname } = useRouter();
  const isAuthPage = pagesWithoutLayout.some((item) => pathname.includes(item));
  const deviceType = useDeviceType(userAgent);
  const [queryClient] = useState(() => new QueryClient(config));
  const csEmotionCache =
    appDirection === "rtl" ? clientSideRtlEmotionCache : clientSideEmotionCache;

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <CacheProvider value={emotionCache || csEmotionCache}>
          <MuiThemeProvider deviceType={deviceType}>
            <ThemeProvider appTheme={appTheme} appDirection={appDirection}>
              <Provider store={store}>
                <SettingsProvider
                  settingsState={settingsState}
                  defaultAddress={defaultAddress}
                >
                  <AuthProvider authState={authState}>
                    {isAuthPage ? (
                      <MainContainer locale={locale}>
                        <Component uiType={uiType} {...pageProps} />
                      </MainContainer>
                    ) : (
                      <PersistGate loading={null} persistor={persistor}>
                        {() => (
                          <Layout locale={locale}>
                            <Component uiType={uiType} {...pageProps} />
                          </Layout>
                        )}
                      </PersistGate>
                    )}
                  </AuthProvider>
                </SettingsProvider>
              </Provider>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                closeButton={false}
                className="toast-alert"
              />
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${G_TAG}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${G_TAG}');
              `}
              </Script>
            </ThemeProvider>
          </MuiThemeProvider>
        </CacheProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

ExtendedApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);
  const { req } = appContext.ctx;
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  const appTheme = getCookie("theme", appContext.ctx);
  const appDirection = getCookie("dir", appContext.ctx);
  const authState = getCookie("user", appContext.ctx);
  const settingsState = getCookie("settings", appContext.ctx);
  const defaultAddress = getCookie("address", appContext.ctx);
  const locale = getLanguage(getCookie("locale", appContext.ctx));
  const uiType = uiTypes.find(type => type === appContext.router.query?.v) || '1'

  i18n.changeLanguage(locale);
  let props = {
    ...appProps,
    userAgent,
    appTheme,
    appDirection,
    authState,
    settingsState,
    defaultAddress,
    locale,
    uiType
  };

  return props;
};
