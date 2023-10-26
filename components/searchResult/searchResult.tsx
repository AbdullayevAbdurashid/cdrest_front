import React, { useCallback, useEffect, useRef } from "react";
import { Skeleton } from "@mui/material";
import cls from "./searchResult.module.scss";
import { useTranslation } from "react-i18next";
import { Product, IShop } from "interfaces";
import ShopResultItem from "components/searchResultItem/shopResultItem";
import ProductResultItem from "components/searchResultItem/productResultItem";
import Loader from "components/loader/loader";

interface Props {
  shops: IShop[];
  products: Product[];
  isLoading: boolean;
  handleClickItem?: () => void;
  isVisibleShops?: boolean;
  productTotal: number;
  shopTotal: number;
  isFetchingShopsNextPage: boolean;
  isFetchingProductsNextPage: boolean;
  hasProductsNextPage: boolean;
  hasShopsNextPage: boolean;
  fetchShopsNextPage: () => void;
  fetchProductsNextPage: () => void;
}

export default function SearchResult({
  shops,
  products,
  isLoading,
  isVisibleShops,
  handleClickItem,
  productTotal,
  shopTotal,
  isFetchingShopsNextPage,
  isFetchingProductsNextPage,
  hasProductsNextPage,
  hasShopsNextPage,
  fetchShopsNextPage,
  fetchProductsNextPage,
}: Props) {
  const { t } = useTranslation();
  const shopLoader = useRef(null);
  const productLoader = useRef(null);

  const handleObserverShops = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasShopsNextPage) {
        fetchShopsNextPage();
      }
    },
    [hasShopsNextPage, fetchShopsNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserverShops, option);
    if (shopLoader.current) observer.observe(shopLoader.current);
  }, [handleObserverShops, hasShopsNextPage, fetchShopsNextPage]);

  const handleObserverProducts = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasProductsNextPage) {
        fetchProductsNextPage();
      }
    },
    [hasProductsNextPage, fetchProductsNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserverProducts, option);
    if (productLoader.current) observer.observe(productLoader.current);
  }, [handleObserverProducts, hasProductsNextPage, fetchProductsNextPage]);

  return (
    <div>
      {!isLoading ? (
        <div className={cls.wrapper}>
          {isVisibleShops && (
            <div className={`${cls.block} ${cls.line}`}>
              <div className={cls.header}>
                <h3 className={cls.title}>{t("restaurant")}</h3>
                <p className={cls.text}>
                  {t("found.number.results", { count: shopTotal })}
                </p>
              </div>
              <div className={cls.body}>
                {shops.map((item) => (
                  <ShopResultItem
                    key={item.id}
                    data={item}
                    onClickItem={handleClickItem}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={shopLoader} />
          {isFetchingShopsNextPage && <Loader />}

          <div className={cls.block}>
            <div className={cls.header}>
              <h3 className={cls.title}>{t("products")}</h3>
              <p className={cls.text}>
                {t("found.number.results", { count: productTotal })}
              </p>
            </div>
            <div className={cls.body}>
              {products.map((item) => (
                <ProductResultItem
                  key={item.id}
                  data={item}
                  onClickItem={handleClickItem}
                />
              ))}
            </div>
          </div>
          <div ref={productLoader} />
          {isFetchingProductsNextPage && <Loader />}
        </div>
      ) : (
        <div className={cls.wrapper}>
          <div className={cls.container}>
            {Array.from(new Array(2)).map((item, idx) => (
              <Skeleton
                key={"result" + idx}
                variant="rectangular"
                className={cls.shimmer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
