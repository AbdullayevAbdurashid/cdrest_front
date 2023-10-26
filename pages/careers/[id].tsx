import React from "react";
import SEO from "components/seo";
import { useRouter } from "next/router";
import CareersContent from "containers/content/careersContent";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate, useQuery } from "react-query";
import getLanguage from "utils/getLanguage";
import careerService from "services/career";
import useLocale from "hooks/useLocale";

type Props = {};

export default function CareerSingle({}: Props) {
  const { locale } = useLocale();
  const { query } = useRouter();
  const careerId = Number(query.id);

  const { data } = useQuery(["career", careerId, locale], () =>
    careerService.getById(careerId)
  );

  return (
    <>
      <SEO title={data?.data.translation?.title} />
      <CareersContent data={data?.data} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const queryClient = new QueryClient();
  const careerId = Number(query.id);
  const locale = getLanguage(req.cookies?.locale);

  await queryClient.prefetchQuery(["career", careerId, locale], () =>
    careerService.getById(careerId)
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
