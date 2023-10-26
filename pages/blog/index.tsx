import Loader from "components/loader/loader";
import SEO from "components/seo";
import BlogList from "containers/blogList/blogList";
import { GetStaticProps } from "next";
import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { dehydrate, QueryClient, useInfiniteQuery } from "react-query";
import blogService from "services/blog";
import getLanguage from "utils/getLanguage";
import { getCookie } from "utils/session";

const PER_PAGE = 10;

type Props = {};

export default function BlogPage({}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const loader = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useInfiniteQuery(
      ["blogs", locale],
      ({ pageParam = 1 }) =>
        blogService.getAll({
          page: pageParam,
          perPage: PER_PAGE,
          active: 1,
        }),
      {
        staleTime: 0,
        getNextPageParam: (lastPage: any) => {
          if (lastPage.meta.current_page < lastPage.meta.last_page) {
            return lastPage.meta.current_page + 1;
          }
          return undefined;
        },
      }
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
      <SEO title={t("blog")} />
      <BlogList data={data?.pages?.flatMap((item) => item.data) || []} />
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  const locale = getLanguage(getCookie("locale", ctx));

  await queryClient.prefetchInfiniteQuery(["blogs", locale], () =>
    blogService.getAll({ perPage: PER_PAGE, active: 1 })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 3600,
  };
};
