import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import useLocale from "hooks/useLocale";
import shopService from "services/shop";
import categoryService from "services/category";
import storyService from "services/story";
import bannerService from "services/banner";
import useUserLocation from "hooks/useUserLocation";
import qs from "qs";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import { useSettings } from "contexts/settings/settings.context";

const CategoryContainer = dynamic(() => import("containers/category/category"));
const BannerContainer = dynamic(() => import("containers/banner/v2"));
const ParcelCard = dynamic(() => import("components/parcelCard/v2"));
const AdsContainer = dynamic(() => import("containers/ads/v2"));
const StoreList = dynamic(() => import("containers/storeList/v2"));
const NewsContainer = dynamic(
  () => import("containers/newsContainer/newsContainer")
);
const ShopListSlider = dynamic(
  () => import("containers/shopList/shopListSliderV2")
);

const PER_PAGE = 12;

export default function Home() {
  const { t, locale } = useLocale();
  const location = useUserLocation();
  const currency = useAppSelector(selectCurrency);
  const { settings } = useSettings();
  const activeParcel = Number(settings?.active_parcel) === 1;

  const { data: shopCategories, isLoading: isCategoriesLoading } = useQuery(
    ["shopCategories", locale],
    () => categoryService.getAllShopCategories({ perPage: 10 })
  );

  const { data: stories, isLoading: isStoriesLoading } = useQuery(
    ["stories", locale],
    () => storyService.getAll()
  );

  const { data: banners, isLoading: isBannerLoading } = useQuery(
    ["banners", locale],
    () => bannerService.getAll()
  );

  const { data: shops, isLoading: isShopLoading } = useQuery(
    ["favoriteBrands", location, locale, currency],
    () =>
      shopService.getAll(
        qs.stringify({
          perPage: PER_PAGE,
          currency_id: currency?.id,
          verify: 1,
        })
      )
  );

  const { data: popularShops } = useQuery(
    ["popularShops", location, locale, currency],
    () =>
      shopService.getAll(
        qs.stringify({
          perPage: PER_PAGE,
          address: location,
          open: 1,
          currency_id: currency?.id,
        })
      )
  );

  const { data: recommendedShops } = useQuery(
    ["recommendedShops", locale, location, currency],
    () =>
      shopService.getRecommended({
        address: location,
        currency_id: currency?.id,
      })
  );

  const { data: ads, isLoading: isAdsLoading } = useQuery(["ads", locale], () =>
    bannerService.getAllAds()
  );

  return (
    <>
      <CategoryContainer
        categories={shopCategories?.data?.sort((a, b) => a?.input - b?.input)}
        loading={isCategoriesLoading}
        hasNextPage={
          Number(shopCategories?.meta?.total) >
          Number(shopCategories?.data?.length)
        }
      />
      <BannerContainer
        stories={stories || []}
        banners={banners?.data || []}
        loadingStory={isStoriesLoading}
        loadingBanner={isBannerLoading}
        bannerCount={banners?.meta?.total}
      />
      {activeParcel && <ParcelCard />}
      <StoreList
        title={t("favorite.brands")}
        shops={shops?.data || []}
        loading={isShopLoading}
      />
      {/* {!category_id && !newest && !isFilterActive && isInsideZone && (
        <FeaturedShopsContainer
          title={t("recommended")}
          featuredShops={recommendedShops?.data || []}
          loading={recommendedLoading}
        />
      )} */}
      {!!popularShops?.data?.length && (
        <ShopListSlider
          title={t("popular.near.you")}
          shops={popularShops?.data || []}
          type="popular"
        />
      )}
      {!!banners?.data?.length && (
        <AdsContainer data={ads?.data || []} loading={isAdsLoading} />
      )}
      {!!recommendedShops?.data?.length && (
        <ShopListSlider
          title={t("daily.offers")}
          shops={recommendedShops?.data || []}
          type="recomended"
        />
      )}
      <NewsContainer />
    </>
  );
}
