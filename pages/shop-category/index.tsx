import React, { useCallback, useEffect, useRef } from "react";
import SEO from "components/seo";
import useLocale from "hooks/useLocale";
import { useInfiniteQuery } from "react-query";
import categoryService from "services/category";
import Loader from "components/loader/loader";
import CategoryList from "containers/categoryList/categoryList";

type Props = {};

export default function ShopCategoryPage({}: Props) {
  const { locale } = useLocale();
  const loader = useRef(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["shopCategoryList", locale],
    ({ pageParam = 1 }) =>
      categoryService.getAllShopCategories({
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
  const shopCategories = data?.pages?.flatMap((item) => item.data) || [];

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
      <SEO />
      <CategoryList categories={shopCategories} loading={isLoading} />
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />
    </>
  );
}
