import React from "react";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { getCookie } from "utils/session";
import getLanguage from "utils/getLanguage";
import categoryService from "services/category";
import { QueryClient, dehydrate, useQuery } from "react-query";
import SEO from "components/seo";
import useLocale from "hooks/useLocale";
import { useRouter } from "next/router";
import informationService from "services/information";
import createSettings from "utils/createSettings";

const uiTypes = {
  "1": dynamic(() => import("containers/shopCategory/v2")),
  "2": dynamic(() => import("containers/shopCategory/v2")),
  "3": dynamic(() => import("containers/shopCategory/v3")),
  "4": dynamic(() => import("containers/shopCategory/v4")),
};

type PageProps = {
  uiType?: keyof typeof uiTypes;
};

const params = {
  active: 1,
  status: "published",
};

export default function ShopCategorySinglePage({ uiType = "1" }: PageProps) {
  const Ui = uiTypes[uiType];
  const { locale } = useLocale();
  const { query } = useRouter();
  const categoryId = String(query?.id);

  const { data } = useQuery(["category", categoryId, locale], () =>
    categoryService.getById(categoryId, params)
  );

  return (
    <>
      <SEO title={data?.data?.translation?.title} />
      <Ui />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const categoryId = String(ctx.query.id);
  const locale = getLanguage(ctx.req.cookies?.locale);
  const settingsData = await informationService.getSettings();
  const obj = createSettings(settingsData?.data);

  await queryClient.prefetchQuery(["category", categoryId, locale], () =>
    categoryService.getById(categoryId, params)
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      uiType: process.env.NEXT_PUBLIC_UI_TYPE || obj?.ui_type,
    },
  };
};
