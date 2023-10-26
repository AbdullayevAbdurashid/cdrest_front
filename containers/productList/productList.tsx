import React from "react";
import { Product } from "interfaces";
import cls from "./productList.module.scss";
import { Grid, Skeleton, useMediaQuery } from "@mui/material";
import ProductCard from "components/productCard/productCard";
import { useAppDispatch } from "hooks/useRedux";
import { setProduct } from "redux/slices/product";
import { useRouter } from "next/router";

type Props = {
  title?: string;
  products: Product[];
  loading?: boolean;
  uuid?: string;
};

export default function ProductList({
  title,
  products,
  loading = false,
  uuid = "popular",
}: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const dispatch = useAppDispatch();
  const { query } = useRouter();

  const handleOpenProduct = (event: any, data: Product) => {
    event.preventDefault();
    dispatch(setProduct({ product: data }));
  };

  let tempProducts = [...products];
  if (query?.sort === "price_asc") {
    tempProducts.sort(
      (a, b) => (a.stock?.total_price || 0) - (b.stock?.total_price || 0)
    );
  }
  if (query?.sort === "price_desc") {
    tempProducts.sort(
      (a, b) => (b.stock?.total_price || 0) - (a.stock?.total_price || 0)
    );
  }
  if (!query?.sort) {
    tempProducts = products;
  }

  return (
    <section
      className="shop-container"
      id={uuid}
      style={{
        display: !loading && products.length === 0 ? "none" : "block",
      }}
    >
      <div className={cls.container}>
        <div className={cls.header}>
          <h2 className={cls.title}>{title}</h2>
        </div>
        <div className={cls.list}>
          {!loading
            ? tempProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  data={item}
                  handleOpen={handleOpenProduct}
                />
              ))
            : Array.from(new Array(4)).map((item, idx) => (
                <Skeleton
                  variant="rectangular"
                  key={item}
                  className={cls.shimmer}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
