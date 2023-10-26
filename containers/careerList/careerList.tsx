import React from "react";
import cls from "./careerList.module.scss";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import { ICareer } from "interfaces/career.interface";
import useLocale from "hooks/useLocale";
import { Skeleton } from "@mui/material";
import Empty from "components/empty/empty";

type Props = {
  data: ICareer[];
  loading?: boolean;
};

export default function CareerList({ data = [], loading = false }: Props) {
  const { t } = useLocale();

  return (
    <div className={cls.root}>
      {!loading
        ? data.map((item) => (
            <Link
              key={item.id}
              href={`/careers/${item.id}`}
              className={cls.wrapper}
            >
              <div className={cls.naming}>
                <h3 className={cls.title}>{item.translation?.title}</h3>
                <p className={cls.text}>{t("role")}</p>
              </div>
              <div className={cls.naming}>
                <h3 className={cls.title}>
                  {item.category?.translation?.title}
                </h3>
                <p className={cls.text}>{t("category")}</p>
              </div>
              <div className={cls.naming}>
                <h3 className={cls.title}>{item.translation?.address}</h3>
                <p className={cls.text}>{t("location")}</p>
              </div>
              <div className={cls.actions}>
                <div className={cls.arrowBtn}>
                  <ArrowRightSLineIcon />
                </div>
              </div>
            </Link>
          ))
        : Array.from(new Array(3)).map((item, idx) => (
            <Skeleton
              key={"careers" + idx}
              variant="rectangular"
              className={cls.shimmer}
            />
          ))}

      {!loading && !data.length && <Empty text={t("no.careers.found")} />}
    </div>
  );
}
