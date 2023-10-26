import React, { useEffect } from "react";
import SEO from "components/seo";
import OrderMap from "containers/orderMap/orderMap";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useAppDispatch } from "hooks/useRedux";
import { setRoleId } from "redux/slices/chat";
import { Order } from "interfaces";
import parcelService from "services/parcel";
import useLocale from "hooks/useLocale";
import ParcelHeader from "containers/orderHeader/parcelHeader";
import ParcelContainer from "containers/orderContainer/parcelContainer";
import dynamic from "next/dynamic";
import useModal from "hooks/useModal";

type Props = {};
const ParcelReview = dynamic(() => import('containers/parcelReviewContainer/parcelReviewContainer'))

export default function ParcelSingle({}: Props) {
  const { locale } = useLocale();
  const { query } = useRouter();
  const parcelId = Number(query.id);
  const dispatch = useAppDispatch();
  const [openModal, handleOpen, handleClose] = useModal();

  const { data, isLoading, refetch } = useQuery(
    ["parcel", parcelId, locale],
    () => parcelService.getById(parcelId),
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
      <ParcelHeader data={data?.data} loading={isLoading} />
      <div className="container">
        <OrderMap
          data={
            {
              location: data?.data.address_from,
              shop: {
                id: 0,
                logo_img: "/images/finish.png",
                location: data?.data.address_to,
                translation: { title: "Finish", locale: "en", description: "" },
                price: 0,
                open: true,
              },
            } as Order
          }
          readonly
          loading={isLoading}
        />
        <ParcelContainer data={data?.data} loading={isLoading} />
      </div>
      <ParcelReview open={openModal} onClose={handleClose} refetch={refetch}  />
    </>
  );
}
