import React, { useCallback, useEffect, useRef } from "react";
import SEO from "components/seo";
import HelpContainer from "containers/help/help";
import SupportCard from "components/supportCard/supportCard";
import { dehydrate, QueryClient, useInfiniteQuery } from "react-query";
import faqService from "services/faq";
import Loader from "components/loader/loader";
import { GetServerSideProps } from "next";
import { useTranslation } from "react-i18next";
import getLanguage from "utils/getLanguage";

const PER_PAGE = 12;

type Props = {};

export default function Help({}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const loader = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["faqs", locale],
      ({ pageParam = 1 }) =>
        faqService.getAll({
          page: pageParam,
          perPage: PER_PAGE,
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
    <>
      <SEO title={t("help.center")} />
      <HelpContainer data={data?.pages?.flatMap((item) => item.data) || []}>
        {isFetchingNextPage && <Loader />}
        <div ref={loader} />
        <SupportCard />
      </HelpContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const queryClient = new QueryClient();
  const locale = getLanguage(req.cookies?.locale);

  await queryClient.prefetchInfiniteQuery(["faqs", locale], () =>
    faqService.getAll({ perPage: PER_PAGE })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
