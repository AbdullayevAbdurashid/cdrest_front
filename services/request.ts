//@ts-nocheck
import axios from "axios";
import i18n from "i18n";
import { API_URL } from "constants/constants";
import { getCookieFromBrowser, removeCookie } from "utils/session";
import { error as toastError } from "components/alert/toast";

const request = axios.create({
  baseURL: API_URL,
  timeout: 16000,
});

request.interceptors.request.use(
  (config) => {
    const token = getCookieFromBrowser("access_token");
    const locale = i18n.language;
    if (token) {
      config.headers.Authorization = token;
    }
    config.params = { lang: locale, ...config.params };
    return config;
  },

  (error) => errorHandler(error)
);

function errorHandler(error) {
  if (error?.response) {
    if (error?.response?.status === 403) {
    } else if (error?.response?.status === 401) {
      toastError(i18n.t("unauthorized"), {
        toastId: "unauthorized",
      });
      removeCookie("user");
      removeCookie("access_token");
      window.location.replace("/login");
    }
  }
  console.log("error => ", error);

  return Promise.reject(error.response);
}

request.interceptors.response.use((response) => response.data, errorHandler);

export default request;
