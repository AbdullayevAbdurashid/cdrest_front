import React, { useEffect } from "react";
import SEO from "components/seo";
import OrderHeader from "containers/orderHeader/orderHeader";
import OrderMap from "containers/orderMap/orderMap";
import OrderContainer from "containers/orderContainer/orderContainer";
import { useQuery } from "react-query";
import orderService from "services/order";
import { useRouter } from "next/router";
import useModal from "hooks/useModal";
import dynamic from "next/dynamic";
import RefundInfo from "components/refundInfo/refundInfo";
import { useAppDispatch } from "hooks/useRedux";
import { setRoleId } from "redux/slices/chat";
import { useTranslation } from "react-i18next";

const OrderReview = dynamic(
  () => import("containers/orderReviewContainer/orderReviewContainer")
);

type Props = {};

export default function OrderSingle({}: Props) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { query } = useRouter();
  const [openModal, handleOpen, handleClose] = useModal();
  const orderId = Number(query.id);
  const dispatch = useAppDispatch();

  const { data, isLoading, refetch } = useQuery(
    ["order", orderId, locale],
    () => orderService.getById(orderId),
    {
      refetchOnWindowFocus: true,
      staleTime: 0,
      onSuccess: (data) => {
        if (!data.data.review && data.data.status === "delivered") {
          handleOpen();
        }
        if (data.data.deliveryman) {
          dispatch(setRoleId(data.data.deliveryman.id));
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      dispatch(setRoleId("admin"));
    };
  }, [dispatch]);

  return (
    <>
      <SEO />
      <OrderHeader data={data?.data} loading={isLoading} />
      <div className="container">
        <RefundInfo list={data?.data.order_refunds || []} />
        <OrderMap readonly data={data?.data} loading={isLoading} />
        <OrderContainer data={data?.data} loading={isLoading} />
      </div>
      <OrderReview open={openModal} onClose={handleClose} refetch={refetch} />
    </>
  );
}
