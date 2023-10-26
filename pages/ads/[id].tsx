import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useInfiniteQuery } from "react-query";
import bannerService from "services/banner";
import SEO from "components/seo";
import { GetServerSideProps } from "next";
import getImage from "utils/getImage";
import { useTranslation } from "react-i18next";
import getLanguage from "utils/getLanguage";
import Loader from "components/loader/loader";
import FooterMenu from "containers/footerMenu/footerMenu";
import dynamic from "next/dynamic";
import informationService from "services/information";
import createSettings from "utils/createSettings";

const lists = {
  "1": dynamic(() => import("containers/shopList/shopList")),
  "2": dynamic(() => import("containers/shopList/v2")),
  "4": dynamic(() => import("containers/shopList/v4")),
  "3": dynamic(() => import("containers/shopList/v3"))
};

const PER_PAGE = 12;

type Props = {
  uiType?: keyof typeof lists 
}

export default function AdSingle({uiType = "1"}: Props) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { query } = useRouter();
  const adId = String(query.id);
  const loader = useRef(null);
  const ShopList = lists[uiType] || lists['1']

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["ad", adId, locale],
    ({ pageParam = 1 }) =>
      bannerService.getAdById(adId, {
        page: pageParam,
        perPage: PER_PAGE,
      }),
    {
      getNextPageParam: (lastPage: any, allPages) => {
        if (
          lastPage.data.shops_count > lastPage.data.shops?.length &&
          lastPage.data.shops.length > 0
        ) {
          return allPages.length + 1;
        }
        return undefined;
      },
    }
  );
  const pages = data?.pages?.flatMap((item) => item.data);
  const banner = pages ? pages[0] : {};

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

  if (error) {
    console.log("error => ", error);
  }

  return (
    <>
      <SEO
        title={banner.translation?.title}
        description={banner.translation?.description}
        image={getImage(banner.img)}
      />
      <div style={{ minHeight: "60vh" }} className={uiType === '4' || uiType === '2' ? 'white-bg' : ''}>
        <ShopList
          shops={pages?.flatMap((item) => item.shops) || []}
          loading={isLoading}
        />
        {isFetchingNextPage && <Loader />}
        <div ref={loader} />
      </div>
      <FooterMenu />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const queryClient = new QueryClient();
  const adId = String(query.id);
  const locale = getLanguage(req.cookies?.locale);
  const settingsData = await informationService.getSettings();
  const obj = createSettings(settingsData?.data);

  await queryClient.prefetchInfiniteQuery(["ad", adId, locale], () =>
    bannerService.getAdById(adId, { perPage: PER_PAGE })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      uiType: process.env.NEXT_PUBLIC_UI_TYPE || obj.ui_type
    },
  };
};
