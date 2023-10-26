import React from "react";
import cls from "./zoneShow.module.scss";
import FallbackImage from "components/fallbackImage/fallbackImage";
import getImage from "utils/getImage";
import useLocale from "hooks/useLocale";
import { useQuery } from "react-query";
import bookingService from "services/booking";
import { Skeleton } from "@mui/material";

type Props = {
  zoneId?: string;
};

export default function ZoneShow({ zoneId }: Props) {
  const { locale } = useLocale();

  const { data, isLoading } = useQuery(
    ["zone", locale, zoneId],
    () => bookingService.getZoneById(Number(zoneId)),
    {
      enabled: !!zoneId,
      select: (data) => data.data,
    }
  );

  return (
    <div className={cls.wrapper}>
      <h1 className={cls.title}>{data?.translation?.title}</h1>
      <div className={cls.flex}>
        <aside className={cls.aside}>
          <div className={cls.imageWrapper}>
            {!isLoading ? (
              <FallbackImage
                fill
                src={getImage(data?.img)}
                alt={data?.translation?.title}
                sizes="320px"
                quality={90}
              />
            ) : (
              <Skeleton variant="rectangular" className={cls.shimmer} />
            )}
          </div>
        </aside>
        <main className={cls.main}>
          <div className={cls.body}>
            {!isLoading ? (
              <>
                <h1 className={cls.title}>{data?.translation?.title}</h1>
                <p className={cls.text}>{data?.translation?.description}</p>
              </>
            ) : (
              <div className={cls.shimmerContainer}>
                <Skeleton variant="text" className={cls.textShimmer} />
                <Skeleton variant="rectangular" className={cls.shimmer} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
