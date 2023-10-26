import React from "react";
import SEO from "components/seo";
import WelcomeContainer from "containers/welcome/welcome";
import WelcomeHero from "components/welcomeHero/welcomeHero";
import WhyChooseUs from "components/whyChooseUs/whyChooseUs";
import { QueryClient, dehydrate, useQuery } from "react-query";
import useLocale from "hooks/useLocale";
import blogService from "services/blog";
import WelcomeBlog from "components/welcomeBlog/welcomeBlog";
import FaqContainer from "containers/faq/faq";
import faqService from "services/faq";
import { GetStaticProps } from "next";
import getLanguage from "utils/getLanguage";
import { getCookie } from "utils/session";
import pageService from "services/page";

type Props = {};

export default function Welcome({}: Props) {
  const { locale } = useLocale();

  const { data } = useQuery(["landingPage", locale], () =>
    pageService.getLandingPage()
  );

  const { data: stats } = useQuery(["stats", locale], () =>
    pageService.getStatistics()
  );

  const { data: blog } = useQuery(["lastBlog", locale], () =>
    blogService.getLastBlog()
  );

  const { data: faqs } = useQuery(["faqs", locale], () => faqService.getAll());

  return (
    <>
      <SEO />
      <WelcomeContainer>
        <WelcomeHero data={data?.data?.data} stats={stats?.data} />
        <WhyChooseUs data={data?.data?.data} />
        <WelcomeBlog data={blog?.data} />
        <FaqContainer data={faqs?.data} />
      </WelcomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  const locale = getLanguage(getCookie("locale", ctx));

  await queryClient.prefetchQuery(["landingPage", locale], () =>
    pageService.getLandingPage()
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 3600,
  };
};
