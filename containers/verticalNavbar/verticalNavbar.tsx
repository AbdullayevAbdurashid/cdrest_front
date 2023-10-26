import React, { useRef, useEffect, useCallback } from "react";
import { Category } from "interfaces";
import cls from "./verticalNavbar.module.scss";
import { useTranslation } from "react-i18next";
import ScrollspyNav from "react-scrollspy-nav";
import Link from "next/link";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("components/loader/loader"));

type Props = {
  categories: Category[];
  loading?: boolean;
  fetchNextPageCategory: () => void;
  hasNextPageCategory?: boolean;
  isFetchingNextPageCategory?: boolean;
};

export default function VerticalNavbar({
  categories = [],
  loading,
  fetchNextPageCategory,
  hasNextPageCategory,
  isFetchingNextPageCategory,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const loader = useRef(null);

  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      console.log("intersecting", target.isIntersecting, hasNextPageCategory);
      if (target.isIntersecting && hasNextPageCategory) {
        fetchNextPageCategory();
      }
    },
    [fetchNextPageCategory, hasNextPageCategory]
  );

  useEffect(() => {
    const option = {
      root: null,
      // rootMargin: "50px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  return (
    <div className={cls.container}>
      <div className={cls.wrapper}>
        <Link href="/" className={cls.backButton}>
          <ArrowLeftLineIcon />
          <span className={cls.text}>{t("all.shops")}</span>
        </Link>
        <h3 className={cls.title}>{t("catalog")}</h3>
        {!loading ? (
          <ul className={cls.navbar}>
            <li className={cls.navItem}>
              <a href={`#popular`} className={`${cls.navLink}`}>
                {t("popular")}
              </a>
            </li>
            {categories.map((item) => (
              <li key={item.id} className={cls.navItem}>
                <Link
                  href={{
                    query: { category_id: item.id, id: router.query?.id },
                  }}
                  shallow
                  className={`${cls.navLink} ${
                    router.query?.category_id === item.id.toString()
                      ? cls.active
                      : ""
                  }`}
                >
                  <Image
                    src={item.img || ""}
                    width={34}
                    className={cls.navIcon}
                    height={34}
                    alt={item.translation.title}
                  />{" "}
                  {item.translation?.title}
                </Link>
              </li>
            ))}
            {isFetchingNextPageCategory && <Loader />}
            <div ref={loader} className="loader" />
          </ul>
        ) : (
          Array.from(new Array(4)).map((_, idx) => (
            <Skeleton
              key={"category" + idx}
              variant="rectangular"
              className={cls.shimmer}
            />
          ))
        )}
      </div>
    </div>
  );
}
