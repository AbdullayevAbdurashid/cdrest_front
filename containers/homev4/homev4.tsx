import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import categoryService from "services/category";
import cls from "./homev4.module.scss";
import bannerService from "services/banner";
import { useTranslation } from "react-i18next";
import shopService from "services/shop";
import qs from "qs";
import { EveryDay, Flash, Gift } from "components/icons";
import AnnouncementList from "containers/announcementList/announcementList";
import storyService from "services/story";
import useUserLocation from "hooks/useUserLocation";
import Loader from "components/loader/loader";
import Link from "next/link";
import { useSettings } from "contexts/settings/settings.context";

const announcements = [
  {
    title: "door.to.door.delivery",
    button: "we.work.for.you",
    color: "yellow",
    img: "/images/v4-announcement1.png",
    icon: <EveryDay />,
  },
  {
    title: "discount.for.first.order",
    button: "for.all.buyers",
    color: "blue",
    img: "/images/v4-announcement2.png",
    icon: <Gift />,
  },
  {
    title: "delivery.in.time",
    button: "until.date",
    color: "pink",
    img: "/images/v4-announcement3.png",
    icon: <Flash />,
  },
];

const ShopCategoryList = dynamic(
  () => import("containers/shopCategoryList/v4")
);
const BannerList = dynamic(() => import("containers/banner/v4"));
const BrandShopList = dynamic(() => import("containers/brandShopList/v4"));
const StoryList = dynamic(() => import("containers/storyList/v4"));
const ShopList = dynamic(() => import("containers/shopList/v4"));
const AdList = dynamic(() => import("containers/adList/v4"));

export default function Homev4() {
  const loader = useRef(null);
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const location = useUserLocation();
  const { settings } = useSettings();
  const activeParcel = Number(settings?.active_parcel) === 1;
  const { data: shopCategoryList, isLoading: shopCategoryLoading } = useQuery(
    ["shopcategory", locale],
    () => categoryService.getAllShopCategories()
  );
  const { data: banners, isLoading: bannerLoading } = useQuery(
    ["banners", locale],
    () => bannerService.getAll()
  );
  const { data: brandShops, isLoading: brandShopLoading } = useQuery(
    ["brandshops", locale, location],
    () =>
      shopService.getAllShops(
        qs.stringify({ verify: "1", address: location, open: "1" })
      )
  );
  const { data: stories, isLoading: isStoriesLoading } = useQuery(
    ["stories", locale, location],
    () => storyService.getAll({ address: location })
  );
  const { data: ads, isLoading: adListLoading } = useQuery(
    ["ads", locale, location],
    () => bannerService.getAllAds({ perPage: 6, address: location })
  );
  const { data: shops, isLoading: isShopLoading } = useQuery(
    ["shops", locale, location],
    () => shopService.getRecommended({ open: 1, address: location })
  );
  const {
    data: nearbyShops,
    isLoading: nearByShopsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["nearbyshops", locale, location],
    ({ pageParam = 1 }) =>
      shopService.getAllShops(
        qs.stringify({
          page: pageParam,
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
  const nearbyShopList = nearbyShops?.pages?.flatMap((item) => item.data) || [];
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
  return (
    <section className={cls.container}>
      <ShopCategoryList
        data={shopCategoryList?.data?.sort((a, b) => a?.input - b?.input) || []}
        loading={shopCategoryLoading}
      />
      <BannerList data={banners?.data || []} loading={bannerLoading} />
      <div className={`${cls.heading} container`}>
        <h2 className={cls.sectionTitle}>{t("choose.by.brand")}</h2>
        <Link className={cls.link} href="/shop?verify=1">
          {t("see.all")}
        </Link>
      </div>
      <BrandShopList data={brandShops?.data || []} loading={brandShopLoading} />

      {activeParcel && (
        <>
          <h2 className={cls.sectionTitle}>{t("especially.for.you")}</h2>
          <div className={cls.sectionSubTitle}>
            {t("especially.for.you.description")}
          </div>
          <AnnouncementList data={announcements} />
        </>
      )}

      {stories?.length !== 0 && (
        <h2 className={cls.sectionTitle}>{t("stories.widget")}</h2>
      )}
      <StoryList data={stories} loading={isStoriesLoading} />
      {ads?.data.length !== 0 && (
        <div className={`${cls.heading} container`}>
          <h2 className={cls.sectionTitle}>{t("explore")}</h2>
          <Link className={cls.link} href="ads">
            {t("see.all")}
          </Link>
        </div>
      )}
      <AdList data={ads?.data} loading={adListLoading} />
      <ShopList
        shops={shops?.data}
        link="/shop?filter=recomended"
        title={t("trending")}
        loading={isShopLoading}
      />
      <ShopList
        title={t("popular.near.you")}
        shops={nearbyShopList}
        link="/shop?filter=popular"
        loading={nearByShopsLoading && !isFetchingNextPage}
      />
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />
    </section>
  );
}
