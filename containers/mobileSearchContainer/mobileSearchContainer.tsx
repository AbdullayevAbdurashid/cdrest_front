import React, { useState } from "react";
import cls from "./mobileSearchContainer.module.scss";
import useDebounce from "hooks/useDebounce";
import ModalContainer from "containers/modal/modal";
import { DialogProps } from "@mui/material";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import MobileSearch from "components/mobileSearch/mobileSearch";
import { useInfiniteQuery } from "react-query";
import shopService from "services/shop";
import productService from "services/product";
import SearchResult from "components/searchResult/searchResult";
import useUserLocation from "hooks/useUserLocation";
import SearchSuggestion from "components/searchSuggestion/searchSuggestion";
import { useDispatch } from "react-redux";
import { addToSearch } from "redux/slices/search";
import { useTranslation } from "react-i18next";

export default function MobileSearchContainer(props: DialogProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400);
  const location = useUserLocation();
  const dispatch = useDispatch();

  const resetSearch = () => setSearchTerm("");

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
      enabled: !!debouncedSearchTerm,
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

  return (
    <ModalContainer {...props} closable={false}>
      <div className={cls.root}>
        <MobileSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className={cls.wrapper}>
          {!!debouncedSearchTerm && (
            <SearchResult
              isVisibleShops
              shops={shops?.pages?.flatMap((item) => item.data) || []}
              products={products?.pages?.flatMap((item) => item.data) || []}
              isLoading={isShopsLoading || isProductsLoading}
              handleClickItem={() => {
                resetSearch();
                if (props.onClose) props.onClose({}, "backdropClick");
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
          )}
          {!debouncedSearchTerm && (
            <SearchSuggestion setSearchTerm={setSearchTerm} />
          )}
        </div>
        <div className={cls.footer}>
          <button
            className={cls.circleBtn}
            onClick={(event) => {
              if (props.onClose) props.onClose(event, "backdropClick");
            }}
          >
            <ArrowLeftLineIcon />
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}
