import React, { useCallback, useEffect, useMemo, useRef } from "react";
import SEO from "components/seo";
import OrdersContainer from "containers/orders/orders";
import dynamic from "next/dynamic";
import { useInfiniteQuery, useQuery } from "react-query";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import qs from "qs";
import useLocale from "hooks/useLocale";
import parcelService from "services/parcel";
import ParcelOrderList from "containers/orderList/parcelOrderList";
import { activeOrderStatuses, orderHistoryStatuses } from "constants/status";

const Loader = dynamic(() => import("components/loader/loader"));
const Empty = dynamic(() => import("components/empty/empty"));
const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));

type Props = {};

export default function ParcelOrders({}: Props) {
  const { t, locale } = useLocale();
  const currency = useAppSelector(selectCurrency);
  const payload = useMemo(
    () => ({
      currency_id: currency?.id,
      order_statuses: true,
      perPage: 10,
      column: "id",
      sort: "desc",
      locale,
    }),
    [currency, locale]
  );
  const loader = useRef(null);

  const { data: activeOrders, isLoading: isLoadingActiveOrders } = useQuery(
    ["parcelActiveOrders", payload],
    () =>
      parcelService.getAll(
        qs.stringify({
          ...payload,
          statuses: activeOrderStatuses,
          perPage: 100,
        })
      ),
    {
      staleTime: 0,
      refetchOnWindowFocus: true,
    }
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["parcelOrderHistory", payload],
    ({ pageParam = 1 }) =>
      parcelService.getAll(
        qs.stringify({
          ...payload,
          page: pageParam,
          statuses: orderHistoryStatuses,
        })
      ),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
    }
  );

  const orders = data?.pages?.flatMap((item) => item.data);

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
        {!isLoading &&
        !orders?.length &&
        !isLoadingActiveOrders &&
        !activeOrders?.data ? (
          ""
        ) : (
          <OrdersContainer title={t("active.parcels")}>
            <ParcelOrderList
              data={activeOrders?.data || []}
              loading={isLoadingActiveOrders}
              active
            />
            {!isLoadingActiveOrders && !activeOrders?.data && (
              <div style={{ padding: "24px 0" }}>
                {t("no.active.orders.found")}
              </div>
            )}
          </OrdersContainer>
        )}
        <OrdersContainer title={t("parcel.history")}>
          <ParcelOrderList
            data={orders || []}
            loading={isLoading && !isFetchingNextPage}
          />
          {isFetchingNextPage && <Loader />}
          <div ref={loader} />
          {!isLoading &&
            !orders?.length &&
            !isLoadingActiveOrders &&
            !activeOrders?.data && (
              <Empty text={t("no.orders.found")} buttonText={t("go.to.menu")} />
            )}
        </OrdersContainer>
        <FooterMenu />
      </div>
    </>
  );
}
