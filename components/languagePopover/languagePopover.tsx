import React, { useContext } from "react";
import RadioInput from "components/inputs/radioInput";
import cls from "./languagePopover.module.scss";
import { Langauge } from "interfaces";
import i18n from "i18n";
import { useQuery } from "react-query";
import languageService from "services/language";
import translationService from "services/translations";
import { ThemeContext } from "contexts/theme/theme.context";
import { setCookie } from "utils/session";
import nProgress from "nprogress";

type Props = {
  onClose: () => void;
};

export default function LanguagePopover({ onClose }: Props) {
  const { data } = useQuery("languages", () => languageService.getAllActive());
  const { setDirection } = useContext(ThemeContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const lang = event.target.value;
    const isRTL = !!data?.data.find((item: Langauge) => item.locale == lang)
      ?.backward;
    nProgress.start();
    onClose();
    translationService
      .getAll({ lang })
      .then(({ data }) => i18n.addResourceBundle(lang, "translation", data))
      .finally(() => {
        setCookie("locale", lang);
        i18n.changeLanguage(lang);
        setDirection(isRTL ? "rtl" : "ltr");
        nProgress.done();
      });
  };

  const controlProps = (item: string) => ({
    checked: i18n.language === item,
    onChange: handleChange,
    value: item,
    id: item,
    name: "language",
    inputProps: { "aria-label": item },
  });

  return (
    <div className={cls.wrapper}>
      {data?.data?.map((item: Langauge) => (
        <div key={item.locale} className={cls.row}>
          <RadioInput {...controlProps(item.locale)} />
          <label className={cls.label} htmlFor={item.locale}>
            <span className={cls.text}>{item.title}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
