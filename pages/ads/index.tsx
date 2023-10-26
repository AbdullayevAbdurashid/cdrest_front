import React, { useCallback, useEffect, useRef } from "react";
import SEO from "components/seo";
import useLocale from "hooks/useLocale";
import { useInfiniteQuery } from "react-query";
import bannerService from "services/banner";
import BannerList from "containers/bannerList/v4";
import Loader from "components/loader/loader";

type Props = {};

export default function Ads({}: Props) {
  const { t, locale } = useLocale();
  const loader = useRef(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["adsPaginate", locale],
    ({ pageParam = 1 }) =>
      bannerService.getAllAds({
        page: pageParam,
        perPage: 10,
      }),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
    }
  );
  const banners = data?.pages?.flatMap((item) => item.data) || [];

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
    <div className="bg-white">
      <SEO title={t("offers")} />
      <BannerList data={banners} loading={isLoading} />
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />
    </div>
  );
}
