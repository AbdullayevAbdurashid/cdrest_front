import React, { useState } from "react";
import cls from "./notificationCenter.module.scss";
import useLocale from "hooks/useLocale";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import notificationService from "services/notification";
import { useAuth } from "contexts/auth/auth.context";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import NotificationCenterItem from "components/notificationCenterItem/notificationCenterItem";
import Loader from "components/loader/loader";
import { CircularProgress, Skeleton } from "@mui/material";
import {
  IUserPushNotification,
  IUserPushNotificationStats,
  NotificationStatus,
} from "interfaces/user.interface";
import { error } from "components/alert/toast";
import { useRouter } from "next/router";

type Props = {
  onClose: () => void;
};
type TabProps = {
  label: string;
  value?: NotificationStatus;
  type: keyof IUserPushNotificationStats;
};

const tabs: TabProps[] = [
  {
    label: "all",
    value: undefined,
    type: "notification",
  },
  {
    label: "news",
    value: NotificationStatus.NEWS_PUBLISH,
    type: "news_publish",
  },
  {
    label: "orders",
    value: NotificationStatus.STATUS_CHANGED,
    type: "status_changed",
  },
  // {
  //   label: "reservations",
  //   value: NotificationStatus.BOOKING_STATUS,
  //   type: "booking_status",
  // },
];

export default function NotificationCenter({ onClose }: Props) {
  const { t, locale } = useLocale();
  const { push } = useRouter();
  const { isAuthenticated } = useAuth();
  const [type, setType] = useState<NotificationStatus | undefined>();

  const {
    data,
    refetch,
    isLoading: isLoadingStatistics,
  } = useQuery(
    ["notificationStatistic", isAuthenticated],
    () => notificationService.getStatistics(),
    {
      enabled: isAuthenticated,
      retry: false,
      refetchInterval: 10000,
      refetchOnWindowFocus: isAuthenticated,
      staleTime: 0,
    }
  );

  const {
    data: list,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["pushNotifications", locale, isAuthenticated, type, data?.notification],
    ({ pageParam = 1 }) =>
      notificationService.getAll({
        page: pageParam,
        perPage: 5,
        type,
        column: "id",
        sort: "desc",
      }),
    {
      staleTime: 0,
      enabled: isAuthenticated,
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta.current_page < lastPage.meta.last_page) {
          return lastPage.meta.current_page + 1;
        }
        return undefined;
      },
    }
  );

  const notifications = list?.pages?.flatMap((item) => item.data);

  const { mutate: readAll, isLoading: isReadAllLoading } = useMutation({
    mutationFn: (data?: any) => notificationService.readAll(data),
    onSuccess: () => refetch(),
    onError: (err: any) => {
      error(err?.data?.message);
    },
  });

  const { mutate: readMessage } = useMutation({
    mutationFn: (data?: any) => notificationService.readById(data),
    onError: (err: any) => {
      error(err?.data?.message);
    },
  });

  const handleReadMessage = (item: IUserPushNotification) => {
    switch (item.type) {
      case NotificationStatus.STATUS_CHANGED:
        push(`/orders/${item.order?.id}`);
        break;
      case NotificationStatus.BOOKING_STATUS:
        push(`/reservations`);
        break;
      case NotificationStatus.NEWS_PUBLISH:
        push(`/?news=${item.blog?.uuid}`);
        break;
      default:
        break;
    }
    if (!item.read_at) {
      readMessage(item.id);
    }
    onClose();
  };

  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <h1 className={cls.title}>{t("notifications")}</h1>
        <div className={cls.tabs}>
          {tabs.map((item) => (
            <button
              key={item.label}
              className={`${cls.tab} ${type === item.value ? cls.active : ""}`}
              onClick={() => setType(item.value)}
            >
              <span className={cls.text}>{t(item.label)}</span>
              {!!data && data[item.type] ? (
                <span className={cls.badge}>{data[item.type]}</span>
              ) : (
                ""
              )}
            </button>
          ))}
        </div>
      </div>
      <div className={cls.body}>
        <div className={cls.list}>
          {notifications?.map((item) => (
            <NotificationCenterItem
              key={item.id}
              data={item}
              handleClick={handleReadMessage}
            />
          ))}
          {!notifications?.length && !isLoading && (
            <div className={cls.text}>{t("no.notifications")}</div>
          )}
          {isLoading && (
            <div className={cls.shimmerContainer}>
              {Array.from(new Array(3)).map((item, idx) => (
                <Skeleton
                  key={"notify" + idx}
                  variant="rectangular"
                  className={cls.shimmer}
                />
              ))}
            </div>
          )}
        </div>
        <div className={cls.actions}>
          {hasNextPage && (
            <button className={cls.button} onClick={() => fetchNextPage()}>
              {!isFetchingNextPage ? (
                <span className={cls.text}>{t("view.more")}</span>
              ) : (
                <Loader size={24} />
              )}
            </button>
          )}
        </div>
      </div>
      <div className={cls.footer}>
        {!!data?.notification && (
          <button
            className={cls.textBtn}
            onClick={() => readAll({})}
            disabled={isReadAllLoading || isLoadingStatistics}
          >
            {!isReadAllLoading && !isLoadingStatistics ? (
              <CheckDoubleLineIcon />
            ) : (
              <CircularProgress size={24} />
            )}
            <span className={cls.text}>{t("mark.read")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
