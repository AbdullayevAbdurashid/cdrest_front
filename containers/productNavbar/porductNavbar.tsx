import React from "react";
import cls from "./productNavbar.module.scss";
import EqualizerFillIcon from "remixicon-react/EqualizerFillIcon";
import { useTranslation } from "react-i18next";
import usePopover from "hooks/usePopover";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@mui/material";

const PopoverContainer = dynamic(() => import("containers/popover/popover"));
const ProductFilter = dynamic(
  () => import("containers/productFilter/productFilter")
);
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));

export default function ProductNavbar() {
  const { t } = useTranslation();
  const [openFilter, anchorFilter, handleOpenFilter, handleCloseFilter] =
    usePopover();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  return (
    <div className={`${cls.container}`}>
      <button className={cls.btn} onClick={handleOpenFilter}>
        <EqualizerFillIcon />
        <span className={cls.text}>{t("filter")}</span>
      </button>
      {isDesktop ? (
        <PopoverContainer
          open={openFilter}
          anchorEl={anchorFilter}
          onClose={handleCloseFilter}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <ProductFilter open={openFilter} handleClose={handleCloseFilter} />
        </PopoverContainer>
      ) : (
        <MobileDrawer open={openFilter} onClose={handleCloseFilter}>
          <ProductFilter open={openFilter} handleClose={handleCloseFilter} />
        </MobileDrawer>
      )}
    </div>
  );
}
