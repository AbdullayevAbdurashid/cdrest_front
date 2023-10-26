import React, { useCallback, useEffect, useRef } from "react";
import cls from "./v4.module.scss";
import categoryService from "services/category";
import { useInfiniteQuery, useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import SEO from "components/seo";
import getImage from "utils/getImage";
import shopService from "services/shop";
import qs from "querystring";
import { useAppSelector } from "hooks/useRedux";
import { selectShopFilter } from "redux/slices/shopFilter";
import Loader from "components/loader/loader";
import Empty from "components/empty/empty";
import { useMediaQuery } from "@mui/material";
import useUserLocation from "hooks/useUserLocation";

const ShopCategoryList = dynamic(
  () => import("containers/shopCategoryList/v1")
);
const ShopList = dynamic(() => import("containers/shopList/shopList"));
const Navbar = dynamic(() => import("containers/navbar/navbar"));
const MobileNavbar = dynamic(
  () => import("containers/mobileNavbar/mobileNavbar")
);

export default function ShopCategory() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const loader = useRef(null);
  const { query } = useRouter();
  const location = useUserLocation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { newest, order_by, group } = useAppSelector(selectShopFilter);
  const { data, isLoading: categoryLoading } = useQuery(
    ["category", query.id, locale],
    () => categoryService.getById(String(query.id), {active: 1})
  );
  const {
    data: shops,
    isLoading: isShopLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["shops", locale, data?.data.id, order_by, group, location, newest, query?.sub],
    ({ pageParam = 1 }) =>
      shopService.getAllShops(
        qs.stringify({
          page: pageParam,
          category_id: query?.sub || data?.data.id,
          order_by: newest ? "new" : order_by,
          free_delivery: group.free_delivery,
          take: group.tag,
          rating: group.rating?.split(","),
          prices: group.prices,
          // @ts-expect-error
            address: location,
          open: Number(group.open) || undefined,
          deals: group.deals,
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

  const shopList = shops?.pages?.flatMap((item) => item.data) || [];

  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver, hasNextPage, fetchNextPage]);

  return (
    <section className={cls.container}>
      <SEO
        title={data?.data?.translation?.title}
        description={data?.data?.translation?.description}
        image={getImage(data?.data?.img)}
      />
      <ShopCategoryList
        data={data?.data.children || []}
        loading={categoryLoading}
        parent={String(query.id)}
      />
      {isDesktop ? <Navbar data={data?.data} hideCategories /> : <MobileNavbar data={data?.data} hideCategories />}
      {!isShopLoading && shopList.length === 0 ? (
        <Empty text={t("there.is.no.shops")} />
      ) : (
        <ShopList shops={shopList} title={data?.data.translation?.title} loading={isShopLoading} />
      )}
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />
    </section>
  );
}
