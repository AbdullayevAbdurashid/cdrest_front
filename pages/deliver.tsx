import React from "react";
import SEO from "components/seo";
import BeDelivery from "containers/beDelivery/beDelivery";
import { GetStaticProps } from "next";
import { QueryClient, dehydrate, useQuery } from "react-query";
import { getCookie } from "utils/session";
import getLanguage from "utils/getLanguage";
import pageService from "services/page";
import useLocale from "hooks/useLocale";

type Props = {};

export default function Deliver({}: Props) {
  const { t, locale } = useLocale();

  const { data, error } = useQuery(["deliver", locale], () =>
    pageService.getDeliverPage()
  );

  if (error) {
    console.log("error => ", error);
  }

  return (
    <>
      <SEO title={t("become.delivery")} />
      <BeDelivery data={data?.data} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  const locale = getLanguage(getCookie("locale", ctx));

  await queryClient.prefetchQuery(["deliver", locale], () =>
    pageService.getDeliverPage()
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 3600,
  };
};
