import React, { useCallback, useEffect, useRef } from "react";
import SEO from "components/seo";
import OrdersContainer from "containers/orders/orders";
import CareerList from "containers/careerList/careerList";
import useLocale from "hooks/useLocale";
import { useInfiniteQuery } from "react-query";
import careerService from "services/career";
import Loader from "components/loader/loader";

type Props = {};

export default function Careers({}: Props) {
  const { t, locale } = useLocale();
  const loader = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["careers", locale],
      ({ pageParam = 1 }) => careerService.getAll({ page: pageParam, active: 1 }),
      {
        getNextPageParam: (lastPage: any) => {
          if (lastPage.meta.current_page < lastPage.meta.last_page) {
            return lastPage.meta.current_page + 1;
          }
          return undefined;
        },
      }
    );

  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, fetchNextPage]
  );

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
      <SEO title={t("careers")} />
      <div className="bg-white">
        <OrdersContainer title={t("careers")}>
          <CareerList
            data={data?.pages?.flatMap((item) => item.data) || []}
            loading={isLoading && !isFetchingNextPage}
          />
          {isFetchingNextPage && <Loader />}
          <div ref={loader} />
        </OrdersContainer>
      </div>
    </>
  );
}
