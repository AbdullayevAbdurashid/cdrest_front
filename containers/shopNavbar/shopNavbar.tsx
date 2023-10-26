import React, { useMemo } from "react";
import { Category } from "interfaces";
import cls from "./shopNavbar.module.scss";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import usePopover from "hooks/usePopover";
import ScrollspyNav from "react-scrollspy-nav";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";

const CategoryDropdown = dynamic(
  () => import("components/categoryDropdown/categoryDropdown")
);

type Props = {
  categories: Category[];
  loading?: boolean;
};

export default function ShopNavbar({ categories = [], loading }: Props) {
  const { t } = useTranslation();
  const [openDropdown, anchorDropdown, handleOpenPopover, handleClosePopover] =
    usePopover();

  const { list, rest } = useMemo(() => {
    if (categories.length > 5) {
      return {
        list: categories.slice(0, 5),
        rest: categories.slice(5),
      };
    }
    return {
      list: categories,
      rest: [],
    };
  }, [categories]);

  return (
    <div className={cls.container}>
      <div className="shop-container">
        <div className={cls.wrapper}>
          {!loading ? (
            <ScrollspyNav
              scrollTargetIds={[
                "popular",
                ...categories.map((item) => item.uuid),
              ]}
              offset={-150}
              activeNavClass={cls.active}
              scrollDuration="200"
            >
              <ul className={cls.navbar}>
                <li className={cls.navItem}>
                  <a href={`#popular`} className={`${cls.navLink}`}>
                    {t("popular")}
                  </a>
                </li>
                {list.map((item) => (
                  <li key={item.id} className={cls.navItem}>
                    <a href={`#${item.uuid}`} className={`${cls.navLink}`}>
                      {item.translation?.title}
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollspyNav>
          ) : (
            <div></div>
          )}
          {rest.length > 0 && (
            <div className={cls.actions}>
              <button className={cls.btn} onClick={handleOpenPopover}>
                <span className={cls.text}>{t("more")}</span>
                <ArrowDownSLineIcon />
              </button>
            </div>
          )}
        </div>
      </div>
      <CategoryDropdown
        data={rest}
        open={openDropdown}
        anchorEl={anchorDropdown}
        onClose={handleClosePopover}
      />
    </div>
  );
}
