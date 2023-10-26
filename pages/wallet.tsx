import React, { useCallback, useEffect, useRef } from "react";
import SEO from "components/seo";
import OrdersContainer from "containers/orders/orders";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { useInfiniteQuery } from "react-query";
import Loader from "components/loader/loader";
import walletService from "services/wallet";
import WalletHistory from "containers/orderList/walletHistory";
import useModal from "hooks/useModal";
import { useMediaQuery } from "@mui/material";
import { selectCurrency } from "redux/slices/currency";
import { useAppSelector } from "hooks/useRedux";

const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));
const ModalContainer = dynamic(() => import("containers/modal/modal"));
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));
const WalletTopup = dynamic(() => import("components/walletTopup/walletTopup"));

type Props = {};

export default function Wallet({}: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const loader = useRef(null);
  const [open, handleOpen, handleClose] = useModal();
  const currency = useAppSelector(selectCurrency);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["walletHistory", currency?.id],
    ({ pageParam = 1 }) =>
      walletService.getAll({ page: pageParam, currency_id: currency?.id }),
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
        <OrdersContainer
          title={t("wallet.history")}
          handleWalletClick={handleOpen}
          wallet
        >
          <WalletHistory
            data={data?.pages?.flatMap((item) => item.data) || []}
            loading={isLoading && !isFetchingNextPage}
          />
          {isFetchingNextPage && <Loader />}
          <div ref={loader} />
        </OrdersContainer>
        <FooterMenu />

        {isDesktop ? (
          <ModalContainer open={open} onClose={handleClose}>
            <WalletTopup handleClose={handleClose} />
          </ModalContainer>
        ) : (
          <MobileDrawer open={open} onClose={handleClose}>
            <WalletTopup handleClose={handleClose} />
          </MobileDrawer>
        )}
      </div>
    </>
  );
}
