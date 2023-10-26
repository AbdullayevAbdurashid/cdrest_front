import React from "react";
import SEO from "components/seo";
import Content from "containers/content/content";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { GetStaticProps } from "next";
import informationService from "services/information";
import { useTranslation } from "react-i18next";
import { getCookie } from "utils/session";
import getLanguage from "utils/getLanguage";

type Props = {};

export default function ReferralTerms({}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const { data, error } = useQuery(["referral-terms", locale], () =>
    informationService.getReferrals()
  );

  if (error) {
    console.log("error => ", error);
  }

  return (
    <>
      <SEO title={t("referral.terms")} />
      <Content
        data={{
          title: t("referral.terms"),
          description: data?.data?.translation?.faq,
          locale: data?.data?.translation?.locale,
        }}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  const locale = getLanguage(getCookie("locale", ctx));

  await queryClient.prefetchQuery(["referral-terms", locale], () =>
    informationService.getReferrals()
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 3600,
  };
};
