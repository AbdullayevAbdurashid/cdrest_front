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

const CategoryContainer = dynamic(() => import("containers/category/v3"));
const BannerContainer = dynamic(() => import("containers/banner/v3"));
const ParcelCard = dynamic(() => import("components/parcelCard/v3"));
const StoreList = dynamic(() => import("containers/storeList/v3"));
const NewsContainer = dynamic(
  () => import("containers/newsContainer/newsContainer")
);
const FeaturedShopsContainer = dynamic(
  () => import("containers/featuredShopsContainer/v3")
);
const ShopBanner = dynamic(() => import("components/shopBanner/shopBanner"));

const PER_PAGE = 12;

export default function Home() {
  const { t, locale } = useLocale();
  const { settings } = useSettings();
  const location = useUserLocation();
  const currency = useAppSelector(selectCurrency);
  const activeParcel = Number(settings?.active_parcel) === 1;

  const { data: shopCategories, isLoading: isCategoriesLoading } = useQuery(
    ["shopCategories", locale],
    () => categoryService.getAllShopCategories({ perPage: 100 })
  );

  const { data: stories, isLoading: isStoriesLoading } = useQuery(
    ["stories", locale],
    () => storyService.getAll()
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

  const { data: popularShops, isLoading: popularLoading } = useQuery(
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

  const { data: recommendedShops, isLoading: recommendedLoading } = useQuery(
    ["recommendedShops", locale, location, currency],
    () =>
      shopService.getRecommended({
        address: location,
        currency_id: currency?.id,
      })
  );

  const { data: ads } = useQuery(["ads", locale], () =>
    bannerService.getAllAds()
  );

  return (
    <>
      <CategoryContainer
        categories={shopCategories?.data?.sort((a, b) => a?.input - b?.input)}
        loading={isCategoriesLoading}
      />
      <FeaturedShopsContainer
        title={t("trending")}
        featuredShops={recommendedShops?.data || []}
        loading={recommendedLoading}
        type="recomended"
      />
      <BannerContainer
        stories={stories || []}
        loadingStory={isStoriesLoading}
      />
      {activeParcel && <ParcelCard />}
      <StoreList
        title={t("favorite.brands")}
        shops={shops?.data || []}
        loading={isShopLoading}
        ads={ads?.data || []}
      />
      <FeaturedShopsContainer
        title={t("popular.near.you")}
        featuredShops={popularShops?.data || []}
        loading={popularLoading}
        type="popular"
      />
      <ShopBanner data={shops?.data || []} />
      <NewsContainer />
    </>
  );
}
