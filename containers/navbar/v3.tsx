import React from "react";
import { Category } from "interfaces";
import cls from "./v3.module.scss";
import Filter3FillIcon from "remixicon-react/Filter3FillIcon";
import EqualizerFillIcon from "remixicon-react/EqualizerFillIcon";
import ShopFilter from "components/shopFilter/shopFilter";
import ShopSorting from "components/shopSorting/shopSorting";
import dynamic from "next/dynamic";
import Link from "next/link";
import usePopover from "hooks/usePopover";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { selectShopFilter, setShopCategory } from "redux/slices/shopFilter";
import useLocale from "hooks/useLocale";
import { Swiper, SwiperSlide } from "swiper/react";
import FallbackImage from "components/fallbackImage/fallbackImage";
import { NextButton } from "components/carouselArrows/carouselArrows";
import { useMediaQuery } from "@mui/material";

const PopoverContainer = dynamic(() => import("containers/popover/popover"));
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));

const settings = {
  spaceBetween: 10,
  preloadImages: false,
  className: "category-list-v3",
  slidesPerView: "auto" as "auto",
  breakpoints: {
    1140: {
      slidesPerView: 8,
      spaceBetween: 30,
    },
  },
};

type Props = {
  data?: Category;
};

export default function Navbar({ data }: Props) {
  const { t } = useLocale();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const [openFilter, anchorFilter, handleOpenFilter, handleCloseFilter] =
    usePopover();
  const [openSorting, anchorSorting, handleOpenSorting, handleCloseSorting] =
    usePopover();
  const { category_id } = useAppSelector(selectShopFilter);
  const dispatch = useAppDispatch();

  function filterByCategory(event: any, id: any = null) {
    event.preventDefault();
    dispatch(setShopCategory(id));
  }

  return (
    <div className={cls.container}>
      <div className="container">
        <div className={cls.wrapper}>
          <h1 className={cls.title}>{data?.translation?.title}</h1>
          <ul className={cls.navbar}>
            <Swiper {...settings}>
              <SwiperSlide>
                <Link
                  href={`/shop-category`}
                  className={`${cls.item} ${category_id ? "" : cls.active}`}
                  onClick={(event) => filterByCategory(event, null)}
                >
                  <div className={cls.imgWrapper}>
                    <div className={cls.img}>
                      <FallbackImage
                        src={data?.img}
                        alt={data?.translation?.title}
                      />
                    </div>
                  </div>
                  <div className={cls.body}>
                    <span className={cls.text}>{t("all")}</span>
                  </div>
                </Link>
              </SwiperSlide>
              {data?.children?.map((item) => (
                <SwiperSlide key={"store" + item.id}>
                  <Link
                    href={`/shop-category/${item.uuid}`}
                    className={`${cls.item} ${
                      item.id === category_id ? cls.active : ""
                    }`}
                    onClick={(event) => filterByCategory(event, item.id)}
                  >
                    <div className={cls.imgWrapper}>
                      <div className={cls.img}>
                        <FallbackImage
                          src={item.img}
                          alt={item.translation?.title}
                        />
                      </div>
                    </div>
                    <div className={cls.body}>
                      <span className={cls.text}>
                        {item.translation?.title}
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
              {Number(data?.children?.length) > 7 && <NextButton />}
            </Swiper>
          </ul>
          <div className={cls.header}>
            <h2 className={cls.shopTitle}>
              {category_id
                ? data?.children?.find((item) => item.id === category_id)
                    ?.translation?.title
                : t("all")}
            </h2>
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
      </div>
      {isDesktop ? (
        <PopoverContainer
          open={openFilter}
          anchorEl={anchorFilter}
          onClose={handleCloseFilter}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <ShopFilter parentCategoryId={data?.id} handleClose={handleCloseFilter} />
        </PopoverContainer>
      ) : (
        <MobileDrawer open={openFilter} onClose={handleCloseFilter}>
          {openFilter && <ShopFilter parentCategoryId={data?.id} handleClose={handleCloseFilter} />}
        </MobileDrawer>
      )}
      {isDesktop ? (
        <PopoverContainer
          open={openSorting}
          anchorEl={anchorSorting}
          onClose={handleCloseSorting}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <ShopSorting handleClose={handleCloseSorting} />
        </PopoverContainer>
      ) : (
        <MobileDrawer open={openSorting} onClose={handleCloseSorting}>
          <ShopSorting handleClose={handleCloseSorting} />
        </MobileDrawer>
      )}
    </div>
  );
}
