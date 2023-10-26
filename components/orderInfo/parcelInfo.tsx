import React from "react";
import cls from "./orderInfo.module.scss";
import PhoneFillIcon from "remixicon-react/PhoneFillIcon";
import Chat1FillIcon from "remixicon-react/Chat1FillIcon";
import SecondaryButton from "components/button/secondaryButton";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import useModal from "hooks/useModal";
import { useMutation } from "react-query";
import { error, success } from "components/alert/toast";
import { useRouter } from "next/router";
import Chat from "components/chat/chat";
import Avatar from "components/avatar";
import { Parcel } from "interfaces/parcel.interface";
import useLocale from "hooks/useLocale";
import Price from "components/price/price";
import parcelService from "services/parcel";

const ConfirmationModal = dynamic(
  () => import("components/confirmationModal/confirmationModal")
);
const DrawerContainer = dynamic(() => import("containers/drawer/drawer"));

type Props = {
  data?: Parcel;
};

export default function ParcelInfo({ data }: Props) {
  const { t } = useLocale();
  const { push } = useRouter();
  const [openModal, handleOpen, handleClose] = useModal();
  const [openChat, handleOpenChat, handleCloseChat] = useModal();

  const { mutate: orderCancel, isLoading } = useMutation({
    mutationFn: () => parcelService.cancel(data?.id || 0),
    onSuccess: () => {
      handleClose();
      push("/parcels");
      success(t("parcel.cancelled"));
    },
    onError: (err: any) => error(err?.statusCode),
  });

  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <div>
          <h4 className={cls.title}>{t("parcel")}</h4>
          <div className={cls.subtitle}>
            <span className={cls.text}>#{data?.id}</span>
            <span className={cls.dot} />
            <span className={cls.text}>
              {dayjs(data?.created_at).format("MMM DD, HH:mm")}
            </span>
          </div>
        </div>
      </div>
      <div className={cls.address}>
        <label>{t("delivery.address")}</label>
        <h6 className={cls.text}>{data?.address_to?.address}</h6>
        <br />
        <label>{t("delivery.time")}</label>
        <h6 className={cls.text}>
          {dayjs(data?.delivery_date).format("ddd, MMM DD,")}{" "}
          {data?.delivery_time}
        </h6>
        <br />
        <label>{t("payment.type")}</label>
        <h6 className={cls.text} style={{ textTransform: "capitalize" }}>
          {t(data?.transaction?.payment_system.tag)}
        </h6>
        <br />
        <label>{t("payment.status")}</label>
        <h6 className={cls.text} style={{ textTransform: "capitalize" }}>
          {t(data?.transaction?.status)}
        </h6>
      </div>
      <div className={cls.body}>
        <div className={cls.flex}>
          <label>{t("total")}</label>
          <span className={cls.totalPrice}>
            <Price number={data?.total_price} symbol={data?.currency?.symbol} />
          </span>
        </div>
      </div>
      {data?.deliveryman ? (
        <div className={cls.courierBlock}>
          <div className={cls.courier}>
            <div className={cls.avatar}>
              <div className={cls.imgWrapper}>
                <Avatar data={data.deliveryman} />
              </div>
            </div>
            <div className={cls.naming}>
              <h5 className={cls.name}>
                {data.deliveryman.firstname}{" "}
                {data.deliveryman.lastname?.charAt(0)}.
              </h5>
              <p className={cls.text}>{t("driver")}</p>
            </div>
          </div>
          <div className={cls.actions}>
            <a href={`tel:${data.deliveryman.phone}`} className={cls.iconBtn}>
              <PhoneFillIcon />
            </a>
            <button className={cls.iconBtn} onClick={handleOpenChat}>
              <Chat1FillIcon />
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {data?.status === "new" ? (
        <div className={cls.footer}>
          <SecondaryButton type="button" onClick={handleOpen}>
            {t("cancel.order")}
          </SecondaryButton>
        </div>
      ) : (
        ""
      )}

      <ConfirmationModal
        open={openModal}
        handleClose={handleClose}
        onSubmit={orderCancel}
        loading={isLoading}
        title={t("are.you.sure.cancel.order")}
      />

      <DrawerContainer
        open={openChat}
        onClose={handleCloseChat}
        PaperProps={{ style: { padding: 0 } }}
      >
        <Chat />
      </DrawerContainer>
    </div>
  );
}
