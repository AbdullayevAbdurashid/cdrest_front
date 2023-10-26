import dynamic from "next/dynamic";
import { useInfiniteQuery, useQuery } from "react-query";
import shopService from "services/shop";
import { useCallback, useEffect, useMemo, useRef } from "react";
import useUserLocation from "hooks/useUserLocation";
import useLocale from "hooks/useLocale";
import qs from "qs";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import { useRouter } from "next/router";

const Loader = dynamic(() => import("components/loader/loader"));
const Empty = dynamic(() => import("components/empty/empty"));
const ShopList = dynamic(() => import("containers/shopList/v2"));
const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));

const PER_PAGE = 12;
type FilterType = "popular" | "recomended";

export default function ShopsPage() {
  const { t, locale } = useLocale();
  const loader = useRef(null);
  const location = useUserLocation();
  const currency = useAppSelector(selectCurrency);
  const { query } = useRouter();
  const filter = query?.filter as FilterType;

  const {
    data: popularShops,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["popularShopsPaginate", locale, location, currency, filter, query?.verify],
    ({ pageParam = 1 }) =>
      shopService.getAll(
        qs.stringify({
          page: pageParam,
          perPage: PER_PAGE,
          address: location,
          open: filter === "popular" ? 1 : undefined,
          currency_id: currency?.id,
          verify: query?.verify,
        })
      ),
    {
      enabled: filter !== "recomended",
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
    }
  );

  const { data: recommendedShops, isLoading: isRecomendedLoading } = useQuery(
    ["recommendedShops", locale, location, currency, filter],
    () =>
      shopService.getRecommended({
        address: location,
        currency_id: currency?.id,
      }),
    {
      enabled: filter === "recomended",
    }
  );

  const shops = useMemo(() => {
    switch (filter) {
      case "popular":
        return popularShops?.pages?.flatMap((item) => item.data) || [];
      case "recomended":
        return recommendedShops?.data || [];

      default:
        return popularShops?.pages?.flatMap((item) => item.data) || [];
    }
  }, [popularShops, filter, recommendedShops]);

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

  function getTitle(type: FilterType) {
    switch (type) {
      case "popular":
        return t("popular.near.you");
      case "recomended":
        return t("daily.offers");
      default:
        return t("all");
    }
  }

  return (
    <div className="bg-white">
      <ShopList
        title={getTitle(filter)}
        shops={shops}
        loading={(isLoading && !isFetchingNextPage) || isRecomendedLoading}
      />
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />

      {!shops.length &&
        !isLoading &&
        !recommendedShops?.data?.length &&
        !isRecomendedLoading && <Empty text={t("no.shops")} />}
      <FooterMenu />
    </div>
  );
}
