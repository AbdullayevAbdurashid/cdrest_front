import React from "react";
import cls from "./notificationStats.module.scss";
import useModal from "hooks/useModal";
import Notification2LineIcon from "remixicon-react/Notification2LineIcon";
import { useQuery } from "react-query";
import notificationService from "services/notification";
import { useAuth } from "contexts/auth/auth.context";
import ModalContainer from "containers/modal/modal";
import NotificationCenter from "components/notificationCenter/notificationCenter";
import MobileDrawer from "containers/drawer/mobileDrawer";
import { useMediaQuery } from "@mui/material";

type Props = {};

export default function NotificationStats({}: Props) {
  const isMobile = useMediaQuery("(max-width:576px)");
  const { isAuthenticated } = useAuth();
  const [modal, handleOpen, handleClose] = useModal();

  const { data } = useQuery(
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

  return (
    <div>
      <button className={cls.wrapper} onClick={handleOpen}>
        <div className={cls.icon}>
          <Notification2LineIcon />
        </div>
        {!!data?.notification && (
          <div className={cls.badge}>{data?.notification}</div>
        )}
      </button>
      {!isMobile ? (
        <ModalContainer open={modal} onClose={handleClose} position="right">
          <NotificationCenter onClose={handleClose} />
        </ModalContainer>
      ) : (
        <MobileDrawer open={modal} onClose={handleClose}>
          <NotificationCenter onClose={handleClose} />
        </MobileDrawer>
      )}
    </div>
  );
}
