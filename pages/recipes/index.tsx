import React, { useCallback, useEffect, useRef } from "react";
import SEO from "components/seo";
import dynamic from "next/dynamic";
import RecipeListHeader from "containers/recipeListHeader/recipeListHeader";
import { useInfiniteQuery, useQuery } from "react-query";
import categoryService from "services/category";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import recipeService from "services/recipe";
import RecipeList from "containers/recipeList/recipeList";

const Empty = dynamic(() => import("components/empty/empty"));
const Loader = dynamic(() => import("components/loader/loader"));
const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));

const PER_PAGE = 12;

type Props = {};

export default function Recipes({}: Props) {
  const { i18n, t } = useTranslation();
  const locale = i18n.language;
  const { query } = useRouter();
  const categoryId = Number(query.category_id);
  const shopId = Number(query.shop_id);
  const loader = useRef(null);

  const { data: categories } = useQuery(["recipeCategories", locale], () =>
    categoryService.getAllRecipeCategories({ perPage: 100 })
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["recipes", categoryId, shopId, locale],
    ({ pageParam = 1 }) =>
      recipeService.getAll({
        page: pageParam,
        perPage: PER_PAGE,
        category_id: categoryId || undefined,
        shop_id: shopId || undefined,
      }),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
    }
  );
  const recipes = data?.pages?.flatMap((item) => item.data) || [];

  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver, hasNextPage, fetchNextPage]);

  if (error) {
    console.log("error => ", error);
  }

  return (
    <>
      <SEO title={t("recipes.title")} description={t("recipes.description")} />
      <div style={{ minHeight: "100vh" }}>
        <RecipeListHeader categories={categories?.data} />
        <RecipeList data={recipes} loading={isLoading && !isFetchingNextPage} />
        {isFetchingNextPage && <Loader />}
        <div ref={loader} />

        {!recipes.length && !isLoading && <Empty text={t("no.recipes")} />}
      </div>
      <FooterMenu />
    </>
  );
}
