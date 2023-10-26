import React from "react";
import SEO from "components/seo";
import ShopContainer from "containers/shopContainer/shopContainer";
import ShopHeader from "containers/shopHeader/shopHeader";
import ShopNavbar from "containers/shopNavbar/shopNavbar";
import ProductList from "containers/productList/productList";
import { useMediaQuery } from "@mui/material";
import MobileShopNavbar from "containers/mobileShopNavbar/mobileShopNavbar";
import { GetServerSideProps } from "next";
import { dehydrate, QueryClient, useQuery } from "react-query";
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

type Props = {
  memberState: any;
};

export default function Restaurant({ memberState }: Props) {
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

  const { data: productCategories, isLoading: isLoadingCategory } = useQuery(
    ["productCategories", shopId, locale],
    () => categoryService.getAllProductCategories(shopId)
  );

  const { data, error } = useQuery(
    ["shop", shopId, locale],
    () => shopService.getById(shopId),
    { keepPreviousData: true }
  );

  const { data: products, isLoading } = useQuery(
    ["products", shopId, currency?.id, locale],
    () =>
      productService.getAllShopProducts(shopId, { currency_id: currency?.id }),
    {
      staleTime: 0,
    }
  );

  const handleCloseProduct = () => {
    dispatch(clearProduct());
    if (uuid) {
      replace(
        {
          query: {
            id: shopId,
            category_id: query?.category_id,
            sub_category_id: query?.sub_category_id,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

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
      <ShopContainer data={data?.data} memberState={memberState}>
        <ShopHeader />
        {isDesktop ? (
          <ShopNavbar
            categories={productCategories?.data || []}
            loading={isLoadingCategory || isLoading}
          />
        ) : (
          <MobileShopNavbar
            categories={productCategories?.data || []}
            loading={isLoadingCategory || isLoading}
          />
        )}
        <ProductList
          title={t("popular")}
          products={products?.data?.recommended || []}
          loading={isLoading}
        />
        {products ? (
          products.data?.all.map((item: CategoryWithProducts) => (
            <ProductList
              key={item.uuid}
              uuid={item.uuid}
              title={item.translation?.title}
              products={item.products || []}
              loading={isLoading}
            />
          ))
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
      </ShopContainer>
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
