import React from "react";
import SEO from "components/seo";
import RecipeContainer from "containers/recipeContainer/recipeContainer";
import { GetServerSideProps } from "next";
import { dehydrate, QueryClient, useQuery } from "react-query";
import getLanguage from "utils/getLanguage";
import recipeService from "services/recipe";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import RecipeHero from "components/recipeHero/recipeHero";
import RecipeContent from "components/recipeContent/recipeContent";
import dynamic from "next/dynamic";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import useDidUpdate from "hooks/useDidUpdate";

const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));

type Props = {};

export default function RecipeSingle({}: Props) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { query, push } = useRouter();
  const recipeId = Number(query.id);
  const currencyId = Number(query.currency_id);
  const currency = useAppSelector(selectCurrency);

  const { data } = useQuery(["recipe", recipeId, locale, currencyId], () =>
    recipeService.getById(recipeId, { currency_id: currencyId })
  );

  useDidUpdate(() => {
    if (currency?.id !== currencyId) {
      push({ query: { id: recipeId, currency_id: currency?.id } }, undefined, {
        shallow: true,
      });
    }
  }, [currency]);

  return (
    <>
      <SEO
        title={
          data?.data.shop?.translation?.title +
          " - " +
          data?.data.translation?.title
        }
        description={data?.data.translation?.description}
      />
      <RecipeContainer data={data?.data}>
        <RecipeHero />
        <RecipeContent />
      </RecipeContainer>
      <FooterMenu />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const queryClient = new QueryClient();
  const recipeId = Number(query.id);
  const currencyId = Number(query.currency_id);
  const locale = getLanguage(req.cookies?.locale);

  await queryClient.prefetchQuery(
    ["recipe", recipeId, locale, currencyId],
    () => recipeService.getById(recipeId, { currency_id: currencyId })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
