import { useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import { useInfiniteQuery, useQuery } from "react-query";
import shopService from "services/shop";
import { useCallback, useEffect, useRef } from "react";
import categoryService from "services/category";
import { selectShopFilter } from "redux/slices/shopFilter";
import { useAppSelector } from "hooks/useRedux";
import storyService from "services/story";
import bannerService from "services/banner";
import useUserLocation from "hooks/useUserLocation";
import useLocale from "hooks/useLocale";
import qs from "qs";
import { useRouter } from "next/router";

const BannerContainer = dynamic(() => import("containers/banner/banner"));
const Loader = dynamic(() => import("components/loader/loader"));
const ZoneNotFound = dynamic(
  () => import("components/zoneNotFound/zoneNotFound")
);
const Navbar = dynamic(() => import("containers/navbar/navbar"));
const MobileNavbar = dynamic(
  () => import("containers/mobileNavbar/mobileNavbar")
);
const Empty = dynamic(() => import("components/empty/empty"));
const ShopList = dynamic(() => import("containers/shopList/shopList"));
const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));

const PER_PAGE = 12;

export default function ShopsPage() {
  const { t, locale } = useLocale();
  const { query } = useRouter();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const loader = useRef(null);
  const { category_id, newest, order_by, group } =
    useAppSelector(selectShopFilter);
  const location = useUserLocation();

  const { data: stories, isLoading: isStoriesLoading } = useQuery(
    ["stories", locale],
    () => storyService.getAll()
  );

  const { data: banners, isLoading: isBannerLoading } = useQuery(
    ["banners", locale],
    () => bannerService.getAll()
  );

  const { isSuccess: isInsideZone, isLoading: isZoneLoading } = useQuery(
    ["shopZones", location],
    () =>
      shopService.checkZone({
        address: location,
      })
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    [
      "shops",
      category_id,
      locale,
      order_by,
      group,
      location,
      newest,
      query?.verfiy,
    ],
    ({ pageParam = 1 }) =>
      shopService.getAllShops(
        qs.stringify({
          page: pageParam,
          perPage: PER_PAGE,
          category_id: category_id ?? undefined,
          order_by: newest ? "new" : order_by,
          free_delivery: group.free_delivery,
          take: group.tag,
          rating: group.rating?.split(","),
          prices: group.prices,
          address: location,
          open: Number(group.open) || undefined,
          deals: group.deals,
          verify: query?.verify,
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

  const { data: shopCategories } = useQuery("shopCategories", () =>
    categoryService.getAllShopCategories()
  );

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
      <BannerContainer
        stories={stories || []}
        banners={banners?.data || []}
        loadingStory={isStoriesLoading}
        loadingBanner={isBannerLoading}
      />
      {isDesktop ? (
        <Navbar categories={shopCategories?.data || []} />
      ) : (
        <MobileNavbar categories={shopCategories?.data || []} />
      )}
      <ShopList
        title={t("all.shops")}
        shops={data?.pages?.flatMap((item) => item.data) || []}
        loading={isLoading && !isFetchingNextPage}
      />
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />

      {!isInsideZone && !isZoneLoading && <ZoneNotFound />}
      {!shops.length && !isLoading && isInsideZone && (
        <Empty text={t("no.shops")} />
      )}
      <FooterMenu />
    </>
  );
}
