import { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useInfiniteQuery, useQuery } from "react-query";
import shopService from "services/shop";
import categoryService from "services/category";
import { clearFilter, selectShopFilter } from "redux/slices/shopFilter";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import useUserLocation from "hooks/useUserLocation";
import qs from "qs";
import useLocale from "hooks/useLocale";
import { useRouter } from "next/router";

const Loader = dynamic(() => import("components/loader/loader"));
const Navbar = dynamic(() => import("containers/navbar/v3"));
const Empty = dynamic(() => import("components/empty/empty"));
const ShopList = dynamic(() => import("containers/shopList/v3"));
const FooterMenu = dynamic(() => import("containers/footerMenu/footerMenu"));

const PER_PAGE = 12;

export default function ShopCategory() {
  const { t, locale } = useLocale();
  const loader = useRef(null);
  const { category_id, order_by, group } = useAppSelector(selectShopFilter);
  const location = useUserLocation();
  const { query } = useRouter();
  const categoryUuid = String(query?.id);
  const dispatch = useAppDispatch();

  const { data: parentCategory } = useQuery(
    ["category", categoryUuid, locale],
    () => categoryService.getById(categoryUuid)
  );
  const parentCategoryId = parentCategory?.data.id;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["shops", category_id, locale, order_by, group, location, parentCategoryId],
    ({ pageParam = 1 }) =>
      shopService.getAllShops(
        qs.stringify({
          page: pageParam,
          perPage: PER_PAGE,
          category_id: category_id ?? parentCategoryId,
          order_by: order_by,
          free_delivery: group.free_delivery,
          take: group.tag,
          rating: group.rating?.split(","),
          address: location,
          open: Number(group.open) || undefined,
          deals: group.deals,
        })
      ),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
    }
  );
  const shops = data?.pages?.flatMap((item) => item.data) || [];

  const handleObserver = useCallback((entries: any) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  if (error) {
    console.log("error => ", error);
  }

  useEffect(() => {
    return () => {
      dispatch(clearFilter());
    };
  }, [dispatch]);

  return (
    <>
      <Navbar data={parentCategory?.data} />
      <ShopList
        shops={data?.pages?.flatMap((item) => item.data) || []}
        loading={isLoading && !isFetchingNextPage}
      />
      {isFetchingNextPage && <Loader />}
      <div ref={loader} />

      {!shops.length && !isLoading && <Empty text={t("no.shops")} />}
      <FooterMenu />
    </>
  );
}
