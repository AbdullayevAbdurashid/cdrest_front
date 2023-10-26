import React, { useCallback, useEffect, useRef } from "react";
import SEO from "components/seo";
import { useInfiniteQuery } from "react-query";
import useUserLocation from "hooks/useUserLocation";
import useLocale from "hooks/useLocale";
import qs from "qs";
import shopService from "services/shop";
import BrandPage from "containers/brand/brand";
import Loader from "components/loader/loader";
import Empty from "components/empty/empty";

type Props = {};

const PER_PAGE = 20;

export default function Brands({}: Props) {
  const { t, locale } = useLocale();
  const loader = useRef(null);
  const location = useUserLocation();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["brands", locale, location],
    ({ pageParam = 1 }) =>
      shopService.getAll(
        qs.stringify({
          page: pageParam,
          perPage: PER_PAGE,
          address: location,
          open: 1,
        })
      ),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
    }
  );
  const shops = data?.pages?.flatMap((item) => item.data) || [];

  const handleObserver = useCallback((entries: any) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  if (error) {
    console.log("error => ", error);
  }

  return (
    <>
      <SEO title={t("favorite.brands")} />
      <BrandPage
        title={t("favorite.brands")}
        data={shops}
        loading={isLoading && !isFetchingNextPage}
      />
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />
      {!shops.length && !isLoading && <Empty text={t("no.restaurants")} />}
    </>
  );
}
