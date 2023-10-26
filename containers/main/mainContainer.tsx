import React from "react";
import useLocale from "hooks/useLocale";
import { useQuery } from "react-query";
import translationService from "services/translations";

type Props = { children: any; locale: string };

export default function MainContainer({ children, locale }: Props) {
  const { addResourceBundle, changeLanguage } = useLocale();

  useQuery(
    ["translation", locale],
    () => translationService.getAll({ lang: locale }),
    {
      enabled: !!locale,
      onSuccess: (data) => {
        addResourceBundle(locale, "translation", data.data);
        changeLanguage(locale);
      },
    }
  );

  return <>{children}</>;
}
