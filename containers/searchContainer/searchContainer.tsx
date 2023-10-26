import React, { useState } from "react";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import cls from "./searchContainer.module.scss";
import { useTranslation } from "react-i18next";
import useDebounce from "hooks/useDebounce";
import useDidUpdate from "hooks/useDidUpdate";
import SearchResult from "components/searchResult/searchResult";
import { useInfiniteQuery, useQuery } from "react-query";
import shopService from "services/shop";
import productService from "services/product";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import useUserLocation from "hooks/useUserLocation";
import SearchSuggestion from "components/searchSuggestion/searchSuggestion";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { addToSearch, selectSearchHistory } from "redux/slices/search";

const PopoverContainer = dynamic(() => import("containers/popover/popover"));

type Props = {
  searchContainerRef: any;
};

const shopRoutes = ["restaurant", "shop/"];

export default function SearchContainer({ searchContainerRef }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorSuggestion, setAnchorSuggestion] = useState(null);
  const openSuggetion = Boolean(anchorSuggestion);
  const { pathname, query } = useRouter();
  const shopId = Number(query.id);
  const isRestaurantRoute = shopRoutes.some((item) => pathname.includes(item));
  const location = useUserLocation();
  const dispatch = useAppDispatch();
  const history = useAppSelector(selectSearchHistory);

  const { data } = useQuery(
    ["shop", shopId, locale],
    () => shopService.getById(shopId),
    {
      enabled: isRestaurantRoute,
    }
  );

  const {
    data: shops,
    fetchNextPage: fetchShopsNextPage,
    hasNextPage: hasShopsNextPage,
    isFetchingNextPage: isFetchingShopsNextPage,
    isLoading: isShopsLoading,
  } = useInfiniteQuery(
    ["shopResult", debouncedSearchTerm, location, locale],
    ({ pageParam = 1 }) =>
      shopService.search({
        search: debouncedSearchTerm,
        page: pageParam,
        address: location,
        open: 1,
      }),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
      retry: false,
      enabled: !!debouncedSearchTerm && !isRestaurantRoute,
    }
  );

  const {
    data: products,
    fetchNextPage: fetchProductsNextPage,
    hasNextPage: hasProductsNextPage,
    isFetchingNextPage: isFetchingProductsNextPage,
    isLoading: isProductsLoading,
  } = useInfiniteQuery(
    ["productResult", debouncedSearchTerm, locale],
    ({ pageParam = 1 }) =>
      productService.search({
        search: debouncedSearchTerm,
        page: pageParam,
        shop_id: isRestaurantRoute ? query.id : undefined,
        address: location,
      }),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
      retry: false,
      enabled: !!debouncedSearchTerm,
      onSuccess: () => {
        dispatch(addToSearch(debouncedSearchTerm));
      },
    }
  );

  const resetSearch = () => setSearchTerm("");
  const handleOpen = () => setAnchorEl(searchContainerRef.current);
  const handleClose = () => setAnchorEl(null);

  const handleOpenSuggestion = () =>
    setAnchorSuggestion(searchContainerRef.current);
  const handleCloseSuggestion = () => setAnchorSuggestion(null);

  const handleClick = () => {
    handleOpenSuggestion();
    if (debouncedSearchTerm) {
      handleOpen();
      handleCloseSuggestion();
    }
  };

  useDidUpdate(() => {
    if (debouncedSearchTerm) {
      handleOpen();
      handleCloseSuggestion();
    } else {
      handleClose();
      handleOpenSuggestion();
    }
  }, [debouncedSearchTerm]);

  return (
    <div className={cls.search} ref={searchContainerRef}>
      <label htmlFor="search">
        <Search2LineIcon />
      </label>
      <input
        type="text"
        id="search"
        placeholder={
          isRestaurantRoute
            ? t("search.products.in", { shop: data?.data?.translation?.title })
            : t("search.restaurants.products")
        }
        autoComplete="off"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onClick={handleClick}
      />

      <PopoverContainer
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        anchorPosition={{ left: 30, top: 30 }}
        disableAutoFocus
      >
        <SearchResult
          isVisibleShops={!isRestaurantRoute}
          shops={shops?.pages?.flatMap((item) => item.data) || []}
          products={products?.pages?.flatMap((item) => item.data) || []}
          isLoading={isShopsLoading || isProductsLoading}
          handleClickItem={() => {
            // resetSearch();
            handleClose();
          }}
          productTotal={products?.pages ? products.pages[0].meta.total : 0}
          shopTotal={shops?.pages ? shops.pages[0].meta.total : 0}
          isFetchingShopsNextPage={isFetchingShopsNextPage}
          isFetchingProductsNextPage={isFetchingProductsNextPage}
          hasProductsNextPage={!!hasProductsNextPage}
          hasShopsNextPage={!!hasShopsNextPage}
          fetchProductsNextPage={fetchProductsNextPage}
          fetchShopsNextPage={fetchShopsNextPage}
        />
      </PopoverContainer>

      <PopoverContainer
        open={openSuggetion && !!history.length}
        anchorEl={anchorSuggestion}
        onClose={handleCloseSuggestion}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        anchorPosition={{ left: 30, top: 30 }}
        disableAutoFocus
      >
        <SearchSuggestion setSearchTerm={setSearchTerm} />
      </PopoverContainer>
    </div>
  );
}
