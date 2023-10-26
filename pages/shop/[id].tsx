import React, { Fragment, useMemo } from "react";
import SEO from "components/seo";
import StoreContainer from "containers/storeContainer/storeContainer";
import ShopHeader from "containers/shopHeader/shopHeader";
import ProductList from "containers/productList/productList";
import { Stack, useMediaQuery } from "@mui/material";
import MobileShopNavbar from "containers/mobileShopNavbar/mobileShopNavbar";
import { GetServerSideProps } from "next";
import {
  dehydrate,
  QueryClient,
  useQuery,
  useInfiniteQuery,
} from "react-query";
import shopService from "services/shop";
import { useRouter } from "next/router";
import categoryService from "services/category";
import productService from "services/product";
import { CategoryWithProducts } from "interfaces";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import { useTranslation } from "react-i18next";
import { clearProduct, selectProduct } from "redux/slices/product";
import dynamic from "next/dynamic";
import { getCookie, removeCookie } from "utils/session";
import getImage from "utils/getImage";
import getLanguage from "utils/getLanguage";

const ModalContainer = dynamic(() => import("containers/modal/modal"));
const ProductContainer = dynamic(
  () => import("containers/productContainer/productContainer")
);
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));
const PageLoading = dynamic(() => import("components/loader/pageLoading"));
const SubCategoryList = dynamic(
  () => import("containers/subCategoryList/subCategoryList")
);
const ProductNavbar = dynamic(
  () => import("containers/productNavbar/porductNavbar")
);

const PER_PAGE = 10;

type Props = {
  memberState: any;
};

const renderProductList = (
  items: CategoryWithProducts[],
  loading: boolean,
  hasParent?: boolean,
  title?: string
) => {
  return items?.map((item) => {
    return (
      <Fragment key={item.id}>
        <ProductList
          uuid={item.uuid}
          title={title || item.translation?.title}
          products={
            item.products.concat(
              item.children?.length > 0
                ? item.children.flatMap((child) => child.products)
                : []
            ) || []
          }
          loading={loading}
        />
      </Fragment>
    );
  });
};

export default function ShopSingle({ memberState }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { query, replace } = useRouter();
  const shopId = Number(query.id);
  const currency = useAppSelector(selectCurrency);
  const { product, isOpen } = useAppSelector(selectProduct);
  const dispatch = useAppDispatch();
  const isOpenProduct = Boolean(query.product) || isOpen;
  const uuid = String(query.product || "");

  const {
    data: productCategories,
    error: errorCategory,
    fetchNextPage: fetchNextPageCategory,
    hasNextPage: hasNextPageCategory,
    isFetchingNextPage: isFetchingNextPageCategory,
    isLoading: isLoadingCategory,
  } = useInfiniteQuery(
    ["productCategories", shopId, locale],
    ({ pageParam = 1 }) =>
      categoryService.getAllProductCategories(shopId, {
        active: 1,
        status: "published",
        page: pageParam,
        perPage: PER_PAGE,
      }),
    {
      enabled: true,
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
    }
  );

  if (errorCategory) {
    console.error("errorCategory => ", errorCategory);
  }

  const categories = productCategories?.pages?.flatMap((page) => page?.data);

  const { data, error } = useQuery(
    ["shop", shopId, locale],
    () => shopService.getById(shopId),
    { keepPreviousData: true }
  );

  const { data: products, isLoading } = useQuery(
    [
      "products",
      shopId,
      currency?.id,
      locale,
      query?.category_id,
      query?.sub_category_id,
      query?.brands,
    ],
    () => {
      let params: Record<string, string | undefined | number | string[]> = {
        currency_id: currency?.id,
        category_id: query?.sub_category_id || query?.category_id || undefined,
      };
      if (query?.brands) {
        if (Array.isArray(query.brands)) {
          delete params["brand_ids[0]"];
          params = Object.assign(
            params,
            ...query?.brands?.map((brand, index) => ({
              [`brand_ids[${index}]`]: brand,
            }))
          );
        } else {
          params = Object.assign(params, { [`brand_ids[0]`]: query?.brands });
        }
      }

      return productService.getAllShopProducts(shopId, params);
    },
    {
      staleTime: 0,
    }
  );

  const handleCloseProduct = () => {
    dispatch(clearProduct());
    const params: Record<string, string | undefined | number> = {
      id: shopId,
    };
    if (query?.category_id) {
      params.category_id = query?.category_id as string;
    }
    if (query?.sub_category_id) {
      params.sub_category_id = query?.sub_category_id as string;
    }
    if (uuid) {
      replace(
        {
          query: params,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const childCategories = useMemo(
    () =>
      categories?.find(
        (category: any) => category.id.toString() === query?.category_id
      )?.children,
    [categories, query?.category_id]
  );

  if (error) {
    console.log("error => ", error);
    replace("/");
    return <PageLoading />;
  }

  return (
    <>
      <SEO
        title={data?.data?.translation?.title}
        description={data?.data?.translation?.description}
        image={getImage(data?.data?.logo_img)}
      />
      <StoreContainer
        data={data?.data}
        memberState={memberState}
        categories={categories || []}
        categoryLoading={isLoadingCategory}
        fetchNextPageCategory={fetchNextPageCategory}
        hasNextPageCategory={hasNextPageCategory}
        isFetchingNextPageCategory={isFetchingNextPageCategory}
      >
        <ShopHeader />
        {!isDesktop ? (
          <MobileShopNavbar
            categories={categories || []}
            loading={isLoadingCategory}
          />
        ) : (
          <div></div>
        )}
        <div className="shop-container filter-wrapper">
          {!!query?.category_id &&
          !query?.sub_category_id &&
          childCategories &&
          childCategories.length !== 0 ? (
            <SubCategoryList subCategories={childCategories} />
          ) : (
            <></>
          )}
          {!!query?.category_id && !isLoading ? <ProductNavbar /> : <></>}
        </div>
        <ProductList
          title={t("popular")}
          products={products?.data?.recommended || []}
          loading={isLoading}
        />
        {products ? (
          renderProductList(products?.data.all, isLoading, !!query?.category_id)
        ) : (
          <div></div>
        )}
        {isDesktop ? (
          <ModalContainer open={!!isOpenProduct} onClose={handleCloseProduct}>
            <ProductContainer
              handleClose={handleCloseProduct}
              data={product}
              uuid={uuid}
            />
          </ModalContainer>
        ) : (
          <MobileDrawer open={!!isOpenProduct} onClose={handleCloseProduct}>
            <ProductContainer
              handleClose={handleCloseProduct}
              data={product}
              uuid={uuid}
            />
          </MobileDrawer>
        )}
      </StoreContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const shopId = Number(ctx.query.id);
  const groupId = Number(ctx.query.g);
  let memberState = getCookie("member", ctx);
  const locale = getLanguage(ctx.req.cookies?.locale);

  if (memberState && groupId) {
    if (memberState.cart_id !== groupId) {
      removeCookie("member");
      memberState = null;
    }
  }

  await queryClient.prefetchQuery(["shop", shopId, locale], () =>
    shopService.getById(shopId)
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      memberState,
    },
  };
};
