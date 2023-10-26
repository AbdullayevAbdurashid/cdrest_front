import React, { useEffect } from "react";
import cls from "./shopInfo.module.scss";
import { IShop } from "interfaces";
import useModal from "hooks/useModal";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mui/material";
import ModalContainer from "containers/modal/modal";
import MobileDrawer from "containers/drawer/mobileDrawer";
import ShopInfoDetails from "components/shopInfoDetails/shopInfoDetails";
import DeliveryTimes from "components/deliveryTimes/deliveryTimes";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { clearOrder, selectOrder, setDeliveryDate } from "redux/slices/order";
import dayjs from "dayjs";
import { useRouter } from "next/router";

type Props = {
  data?: IShop;
};

export default function ShopInfo({ data }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { order } = useAppSelector(selectOrder);
  const [modal, handleOpen, handleClose] = useModal();
  const [timeDrawer, handleOpenTimeDrawer, handleCloseTimeDrawer] = useModal();
  const { push } = useRouter();

  const handleChangeDeliverySchedule = ({
    date,
    time,
  }: {
    date: string;
    time: string;
  }) => {
    dispatch(
      setDeliveryDate({
        delivery_time: time,
        delivery_date: date,
        shop_id: data?.id,
      })
    );
  };

  useEffect(() => {
    if (order.shop_id !== data?.id) {
      dispatch(clearOrder());
    }
  }, [data]);

  return (
    <div className={cls.flex}>
      <button className={cls.textBtn} onClick={handleOpen}>
        {t("more.info")}
      </button>
      <button className={cls.textBtn} onClick={handleOpenTimeDrawer}>
        {order.delivery_time ? t("edit.schedule") : t("schedule")}
      </button>
      {!!order.delivery_time && (
        <div className={cls.text}>
          {dayjs(order.delivery_date).format("ddd, MMM DD,")}{" "}
          {order.delivery_time}
        </div>
      )}
      <button
        className={cls.textBtn}
        onClick={() =>
          push({
            pathname: "/recipes",
            query: { shop_id: data?.id },
          })
        }
      >
        {t("recipes")}
      </button>

      {isDesktop ? (
        <ModalContainer open={modal} onClose={handleClose} closable={false}>
          {modal && <ShopInfoDetails data={data} onClose={handleClose} />}
        </ModalContainer>
      ) : (
        <MobileDrawer open={modal} onClose={handleClose}>
          {modal && <ShopInfoDetails data={data} onClose={handleClose} />}
        </MobileDrawer>
      )}

      {isDesktop ? (
        <ModalContainer open={timeDrawer} onClose={handleCloseTimeDrawer}>
          <DeliveryTimes
            data={data}
            handleClose={handleCloseTimeDrawer}
            handleChangeDeliverySchedule={handleChangeDeliverySchedule}
          />
        </ModalContainer>
      ) : (
        <MobileDrawer open={timeDrawer} onClose={handleCloseTimeDrawer}>
          <DeliveryTimes
            data={data}
            handleClose={handleCloseTimeDrawer}
            handleChangeDeliverySchedule={handleChangeDeliverySchedule}
          />
        </MobileDrawer>
      )}
    </div>
  );
}
