import React, { useMemo } from "react";
import { Category } from "interfaces";
import cls from "./v2.module.scss";
import Filter3FillIcon from "remixicon-react/Filter3FillIcon";
import EqualizerFillIcon from "remixicon-react/EqualizerFillIcon";
import { useTranslation } from "react-i18next";
import ShopFilter from "components/shopFilter/shopFilter";
import ShopSorting from "components/shopSorting/shopSorting";
import dynamic from "next/dynamic";
import Link from "next/link";
import usePopover from "hooks/usePopover";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { selectShopFilter, setShopCategory } from "redux/slices/shopFilter";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";

const PopoverContainer = dynamic(() => import("containers/popover/popover"));
const CategoryDropdown = dynamic(
  () => import("components/categoryDropdown/categoryDropdown")
);

type Props = {
  categories: Category[];
  data?: Category
};

export default function Navbar({ categories = [], data }: Props) {
  const { t } = useTranslation();
  const [openFilter, anchorFilter, handleOpenFilter, handleCloseFilter] =
    usePopover();
  const [openSorting, anchorSorting, handleOpenSorting, handleCloseSorting] =
    usePopover();
  const [
    openDropdown,
    anchorDropdown,
    handleOpenDropdown,
    handleCloseDropdown,
  ] = usePopover();
  const { category_id, newest } = useAppSelector(selectShopFilter);
  const dispatch = useAppDispatch();

  const { list, rest } = useMemo(() => {
    if (categories.length > 4) {
      return {
        list: categories.slice(0, 4),
        rest: categories.slice(4),
      };
    }
    return {
      list: categories,
      rest: [],
    };
  }, [categories]);

  function filterByCategory(event: any, id: any = null) {
    event.preventDefault();
    dispatch(setShopCategory(id));
  }

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.wrapper}>
          <ul className={cls.navbar}>
            <li className={cls.navItem}>
              <Link
                href="/"
                className={`${cls.navLink} ${
                  category_id || newest ? "" : cls.active
                }`}
                onClick={(event) => filterByCategory(event)}
              >
                {t("all")}
              </Link>
            </li>
            {list.map((item) => (
              <li key={item.id} className={cls.navItem}>
                <Link
                  href="/"
                  className={`${cls.navLink} ${
                    item.id === category_id ? cls.active : ""
                  }`}
                  onClick={(event) => filterByCategory(event, item.id)}
                >
                  {item.translation.title}
                </Link>
              </li>
            ))}
            {rest.length > 0 && (
              <li className={cls.navItem}>
                <button className={cls.moreBtn} onClick={handleOpenDropdown}>
                  <span className={cls.text}>{t("more")}</span>
                  <ArrowDownSLineIcon />
                </button>
              </li>
            )}
          </ul>
          <div className={cls.actions}>
            <button className={cls.btn} onClick={handleOpenSorting}>
              <Filter3FillIcon />
              <span className={cls.text}>{t("sorted.by")}</span>
            </button>
            <button className={cls.btn} onClick={handleOpenFilter}>
              <EqualizerFillIcon />
              <span className={cls.text}>{t("filter")}</span>
            </button>
          </div>
        </div>
      </div>
      <CategoryDropdown
        data={rest}
        handleClickItem={filterByCategory}
        open={openDropdown}
        anchorEl={anchorDropdown}
        onClose={handleCloseDropdown}
      />
      <PopoverContainer
        open={openFilter}
        anchorEl={anchorFilter}
        onClose={handleCloseFilter}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <ShopFilter parentCategoryId={data?.id} handleClose={handleCloseFilter} />
      </PopoverContainer>
      <PopoverContainer
        open={openSorting}
        anchorEl={anchorSorting}
        onClose={handleCloseSorting}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <ShopSorting handleClose={handleCloseSorting} />
      </PopoverContainer>
    </div>
  );
}
