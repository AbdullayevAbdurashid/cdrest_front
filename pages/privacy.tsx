import React from "react";
import SEO from "components/seo";
import Content from "containers/content/content";
import { dehydrate, QueryClient, useQuery } from "react-query";
import faqService from "services/faq";
import { GetStaticProps } from "next";
import { useTranslation } from "react-i18next";
import { getCookie } from "utils/session";
import getLanguage from "utils/getLanguage";

type Props = {};

export default function Privacy({}: Props) {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  const { data, error } = useQuery(["privacy", locale], () =>
    faqService.getPrivacy()
  );

  if (error) {
    console.log("error => ", error);
  }

  return (
    <>
      <SEO title={data?.data?.translation?.title} />
      <Content data={data?.data?.translation} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  const locale = getLanguage(getCookie("locale", ctx));

  await queryClient.prefetchQuery(["privacy", locale], () =>
    faqService.getPrivacy()
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 3600,
  };
};
