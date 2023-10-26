import React from "react";
import { Category } from "interfaces";
import cls from "./v2.module.scss";
import Filter3FillIcon from "remixicon-react/Filter3FillIcon";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import EqualizerFillIcon from "remixicon-react/EqualizerFillIcon";
import dynamic from "next/dynamic";
import useModal from "hooks/useModal";
import { useAppSelector } from "hooks/useRedux";
import { selectShopFilter } from "redux/slices/shopFilter";
import useLocale from "hooks/useLocale";

const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));
const ShopFilter = dynamic(() => import("components/shopFilter/shopFilter"));
const ShopSorting = dynamic(() => import("components/shopSorting/shopSorting"));
const MobileShopCategories = dynamic(
  () => import("components/mobileShopCategories/v2")
);

type Props = {
  categories: Category[];
  data?: Category
};

export default function MobileNavbar({ categories = [], data }: Props) {
  const { t } = useLocale();
  const [visible, handleOpenCategories, handleCloseCategories] = useModal();
  const [sortingDrawer, handleOpenSorting, handleCloseSorting] = useModal();
  const [openFilter, handleOpenFilter, handleCloseFilter] = useModal();
  const { category_id } = useAppSelector(selectShopFilter);

  return (
    <div className={`container ${cls.container}`}>
      <div className={cls.wrapper}>
        <button className={cls.showAllBtn} onClick={handleOpenCategories}>
          <span className={cls.text}>
            {category_id
              ? categories.find((item) => item.id === category_id)?.translation
                  ?.title
              : t("all")}
          </span>
          <ArrowDownSLineIcon />
        </button>
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

      <MobileDrawer open={visible} onClose={handleCloseCategories}>
        <MobileShopCategories
          data={categories}
          onClose={handleCloseCategories}
        />
      </MobileDrawer>

      <MobileDrawer open={openFilter} onClose={handleCloseFilter}>
        {openFilter && <ShopFilter parentCategoryId={data?.id} handleClose={handleCloseFilter} />}
      </MobileDrawer>

      <MobileDrawer open={sortingDrawer} onClose={handleCloseSorting}>
        <ShopSorting handleClose={handleCloseSorting} />
      </MobileDrawer>
    </div>
  );
}
