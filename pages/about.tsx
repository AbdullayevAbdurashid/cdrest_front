import React from "react";
import SEO from "components/seo";
import AboutUs from "containers/aboutUs/aboutUs";
import AppSection from "containers/appSection/appSection";
import { GetStaticProps } from "next";
import { QueryClient, dehydrate, useQuery } from "react-query";
import getLanguage from "utils/getLanguage";
import { getCookie } from "utils/session";
import pageService from "services/page";
import useLocale from "hooks/useLocale";

type Props = {};

export default function About({}: Props) {
  const { t, locale } = useLocale();

  const { data } = useQuery(
    ["sections", locale],
    () => pageService.getAboutSections(),
    {
      select: (data) => {
        if (data.data.length > 1) {
          return {
            about: data.data.find((item) => item.type === "about"),
            sections: data.data.filter((item) => item.type !== "about"),
          };
        }
        return {
          about: data.data[0],
          sections: [],
        };
      },
    }
  );

  return (
    <>
      <SEO title={t("about")} />
      <AboutUs data={data?.about} />
      <AppSection data={data?.sections} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  const locale = getLanguage(getCookie("locale", ctx));

  await queryClient.prefetchQuery(["sections", locale], () =>
    pageService.getAboutSections()
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 3600,
  };
};
