import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useInfiniteQuery } from "react-query";
import bannerService from "services/banner";
import SEO from "components/seo";
import dynamic from "next/dynamic";
import ShopList from "containers/shopList/shopList";
import { GetServerSideProps } from "next";
import BannerHeader from "components/bannerHeader/bannerHeader";
import getImage from "utils/getImage";
import { useTranslation } from "react-i18next";
import getLanguage from "utils/getLanguage";
import Loader from "components/loader/loader";

const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));
const PER_PAGE = 12;

type Props = {};

export default function BannerSinglePage({}: Props) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { query } = useRouter();
  const bannerId = String(query.id);
  const loader = useRef(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["banner", bannerId, locale],
    ({ pageParam = 1 }) =>
      bannerService.getById(bannerId, {
        page: pageParam,
        perPage: PER_PAGE,
      }),
    {
      getNextPageParam: (lastPage: any, allPages) => {
        if (
          lastPage.data.shops_count > lastPage.data.shops.length &&
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
      <div style={{ minHeight: "60vh" }}>
        <BannerHeader data={banner} />
        <ShopList
          shops={data?.pages?.flatMap((item) => item.data.shops) || []}
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
  const bannerId = String(query.id);
  const locale = getLanguage(req.cookies?.locale);

  await queryClient.prefetchInfiniteQuery(["banner", bannerId, locale], () =>
    bannerService.getById(bannerId, { perPage: PER_PAGE })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
