import React from "react";
import { Category } from "interfaces";
import cls from "./mobileShopNavbar.module.scss";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import useModal from "hooks/useModal";

const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));
const MobileProductCategories = dynamic(
  () => import("components/mobileShopCategories/mobileProductCategories")
);

type Props = {
  categories?: Category[];
  loading: boolean;
};

export default function MobileShopNavbar({ categories = [], loading }: Props) {
  const { t } = useTranslation();
  const [visible, handleOpenCategories, handleCloseCategories] = useModal();

  return (
    <div className="white-splash">
      <div className="container">
        <div className={cls.container}>
          <div className={cls.wrapper}>
            <button className={cls.showAllBtn} onClick={handleOpenCategories}>
              <span className={cls.text}>{t("popular")}</span>
              <ArrowDownSLineIcon />
            </button>
          </div>

          {!loading && (
            <MobileDrawer open={visible} onClose={handleCloseCategories}>
              <MobileProductCategories
                data={categories}
                onClose={handleCloseCategories}
              />
            </MobileDrawer>
          )}
        </div>
      </div>
    </div>
  );
}
