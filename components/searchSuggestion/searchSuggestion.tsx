import React from "react";
import cls from "./searchSuggestion.module.scss";
import { useTranslation } from "react-i18next";
import TimeLineIcon from "remixicon-react/TimeLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import {
  clearSearch,
  removeFromSearch,
  selectSearchHistory,
} from "redux/slices/search";

interface Props {
  setSearchTerm: (search: string) => void;
}

export default function SearchSuggestion({ setSearchTerm }: Props) {
  const { t } = useTranslation();
  const history = useAppSelector(selectSearchHistory);
  const dispatch = useAppDispatch();

  function handleClick(event: any, item: string) {
    event.preventDefault();
    setSearchTerm(item);
  }

  function handleClear() {
    dispatch(clearSearch());
  }

  function handleRemove(item: string) {
    dispatch(removeFromSearch(item));
  }

  return (
    <div
      className={cls.wrapper}
      style={{ display: history.length ? "block" : "none" }}
    >
      <div className={cls.header}>
        <h3 className={cls.title}>{t("recent.searches")}</h3>
        <button className={cls.clearBtn} onClick={handleClear}>
          {t("clear")}
        </button>
      </div>
      <div className={cls.body}>
        {history.map((item) => (
          <div key={"search" + item} className={cls.flex}>
            <a
              href="suggestion"
              className={cls.textBtn}
              onClick={(event) => handleClick(event, item)}
            >
              <TimeLineIcon />
              <span className={cls.text}>{item}</span>
            </a>
            <button className={cls.closeBtn} onClick={() => handleRemove(item)}>
              <CloseLineIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
