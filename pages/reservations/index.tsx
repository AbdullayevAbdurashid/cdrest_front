import React, { useCallback, useEffect, useRef } from "react";
import SEO from "components/seo";
import OrdersContainer from "containers/orders/orders";
import dynamic from "next/dynamic";
import { useInfiniteQuery } from "react-query";
import useLocale from "hooks/useLocale";
import bookingService from "services/booking";
import ReservationHistory from "containers/orderList/reservationHistory";

const Loader = dynamic(() => import("components/loader/loader"));
const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));

type Props = {};

export default function ReservationsPage({}: Props) {
  const { t, locale } = useLocale();

  const loader = useRef(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["bookingHistory", locale],
    ({ pageParam = 1 }) =>
      bookingService.getBookingHistory({ page: pageParam }),
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
      <SEO />
      <div className="bg-white">
        <OrdersContainer title={t("reservations")}>
          <ReservationHistory
            data={data?.pages?.flatMap((item) => item.data) || []}
            loading={isLoading && !isFetchingNextPage}
          />
          {isFetchingNextPage && <Loader />}
          <div ref={loader} />
        </OrdersContainer>
        <FooterMenu />
      </div>
    </>
  );
}
