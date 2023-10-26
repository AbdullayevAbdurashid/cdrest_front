import { useTranslation } from "react-i18next";
import usePopover from "hooks/usePopover";
import cls from "./pickers.module.scss";
import PopoverContainer from "containers/popover/popover";
import { useInfiniteQuery } from "react-query";
import useDebounce from "hooks/useDebounce";
import shopService from "services/shop";
import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "components/loader/loader";
import ShopResultWithoutLinkItem from "components/searchResultItem/shopResultWithoutLink";
import { Skeleton } from "@mui/material";
import qs from "qs";
import { IShop } from "interfaces";
import useUserLocation from "hooks/useUserLocation";

type Props = {
  label: string;
  value?: IShop;
  onChange: (value?: IShop) => void;
  error?: boolean;
  hasSection?: number
};

export default function RcShopSelect({ label, value, onChange, error, hasSection }: Props) {
  const { t, i18n } = useTranslation();
  const location = useUserLocation();
  const locale = i18n.language;
  const shopLoader = useRef(null);
  const [open, anchor, handleOpen, handleClose] = usePopover();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400);
  const {
    data: shops,
    fetchNextPage: fetchShopsNextPage,
    hasNextPage: hasShopsNextPage,
    isFetchingNextPage: isFetchingShopsNextPage,
    isLoading: isShopsLoading,
  } = useInfiniteQuery(
    ["shopResult", debouncedSearchTerm, location, locale, hasSection],
    ({ pageParam = 1 }) =>
      shopService.getAllBooking(
        qs.stringify({
          search: debouncedSearchTerm,
          page: pageParam,
          address: location,
          open: 1,
          has_section: hasSection
        })
      ),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
      retry: false,
    }
  );

  const shopList = shops?.pages?.flatMap((item) => item.data) || [];

  const handleObserverShops = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasShopsNextPage) {
        fetchShopsNextPage();
      }
    },
    [hasShopsNextPage, fetchShopsNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserverShops, option);
    if (shopLoader.current) observer.observe(shopLoader.current);
  }, [handleObserverShops, hasShopsNextPage, fetchShopsNextPage]);

  useEffect(() => {
    if (value) {
      setSearchTerm(value?.translation?.title || "");
    }
  }, [value]);

  return (
    <div className={`${cls.container} ${cls.outlined} ${cls.shopContainer}`}>
      <h4 className={cls.title}>{label}</h4>
      <input
        className={`${cls.wrapper} ${error ? cls.error : ""}`}
        type="text"
        id="search_restaurant"
        placeholder={t("search.restaurant")}
        autoComplete="off"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          onChange(undefined);
        }}
        onFocus={handleOpen}
        onBlur={handleClose}
      />
      <PopoverContainer
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        anchorPosition={{ top: 0, left: 0 }}
        disableAutoFocus
      >
        {!isShopsLoading ? (
          <div className={cls.shopWrapper}>
            <div className={`${cls.block} ${cls.line}`}>
              <div className={cls.header}>
                <h3 className={cls.title}>{t("restaurant")}</h3>
                <p className={cls.text}>
                  {t("found.number.results", {
                    count: shops?.pages ? shops.pages[0].meta.total : 0,
                  })}
                </p>
              </div>
              <div style={{ width: "100%" }} className={cls.body}>
                {shopList.map((item) => (
                  <ShopResultWithoutLinkItem
                    key={item.id}
                    data={item}
                    onClickItem={(data) => {
                      onChange(data);
                      handleClose();
                    }}
                  />
                ))}
              </div>
            </div>
            <div ref={shopLoader} />
            {isFetchingShopsNextPage && <Loader />}
          </div>
        ) : (
          <div className={cls.shopWrapper}>
            <div className={cls.container}>
              {Array.from(new Array(2)).map((item, idx) => (
                <Skeleton
                  key={"result" + idx}
                  variant="rectangular"
                  className={cls.shimmer}
                />
              ))}
            </div>
          </div>
        )}
      </PopoverContainer>
    </div>
  );
}
