import React from "react";
import SEO from "components/seo";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate, useQuery } from "react-query";
import shopService from "services/shop";
import getLanguage from "utils/getLanguage";
import { useRouter } from "next/router";
import useLocale from "hooks/useLocale";
import ReservationContainer from "containers/reservation/reservation";
import ReservationAbout from "containers/reservationAbout/reservationAbout";
import ReservationReview from "containers/reservationReview/reservationReview";
import bookingService from "services/booking";

type Props = {};

export default function ReservationShop({}: Props) {
  const { t, locale } = useLocale();
  const { query } = useRouter();
  const shopId = Number(query.id);

  const { data } = useQuery(["bookingShop", locale, shopId], () =>
    bookingService.getBookingSchedule(shopId)
  );

  const { data: reviews } = useQuery(["shopReviews", locale, shopId], () =>
    shopService.getByIdReviews(shopId)
  );

  return (
    <>
      <SEO title={t("reservations")} />
      <ReservationContainer data={data?.data} />
      <ReservationAbout data={data?.data} />
      <ReservationReview data={reviews?.data} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const locale = getLanguage(ctx.req.cookies?.locale);
  const shopId = Number(ctx.query.id);

  await queryClient.prefetchQuery(["bookingShop", locale, shopId], () =>
    bookingService.getBookingSchedule(shopId)
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
