import React, { useEffect, useRef } from "react";
import cls from "./mobileSearch.module.scss";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import { useTranslation } from "react-i18next";

type Props = {
  searchTerm: string;
  setSearchTerm: (event: any) => void;
};

export default function MobileSearch({ searchTerm, setSearchTerm }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cls.search}>
      <label htmlFor="search">
        <Search2LineIcon />
      </label>
      <input
        type="text"
        id="search"
        ref={inputRef}
        placeholder={t("search")}
        autoComplete="off"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </div>
  );
}
