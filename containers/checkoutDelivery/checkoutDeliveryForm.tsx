import React from "react";
import cls from "./checkoutDelivery.module.scss";
import TextInput from "components/inputs/textInput";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import CalendarCheckLineIcon from "remixicon-react/CalendarCheckLineIcon";
import MapPinRangeFillIcon from "remixicon-react/MapPinRangeFillIcon";
import PencilFillIcon from "remixicon-react/PencilFillIcon";
import { useTranslation } from "react-i18next";
import usePopover from "hooks/usePopover";
import dayjs from "dayjs";
import { FormikProps } from "formik";
import { OrderFormValues, IShop } from "interfaces";
import useModal from "hooks/useModal";
import {
  IconButton,
  InputAdornment,
  Stack,
  useMediaQuery,
} from "@mui/material";
import dynamic from "next/dynamic";
import checkIsDisabledDay from "utils/checkIsDisabledDay";
import CheckboxInput from "components/inputs/checkboxInput";
import DeliveryAddressModal from "components/addressModal/deliveryAddressModal";
import EditLineIcon from "remixicon-react/EditLineIcon";
import { useAuth } from "contexts/auth/auth.context";
import CheckLineIcon from "remixicon-react/CheckLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";

const DeliveryTimes = dynamic(
  () => import("components/deliveryTimes/deliveryTimes")
);
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));
const DeliveryTimePopover = dynamic(
  () => import("components/deliveryTimePopover/deliveryTimePopover")
);
const ModalContainer = dynamic(() => import("containers/modal/modal"));

type Props = {
  data: IShop;
  formik: FormikProps<OrderFormValues>;
  onPhoneVerify: () => void;
};

export default function CheckoutDeliveryForm({
  formik,
  data,
  onPhoneVerify,
}: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const [timePopover, anchorEl, handleOpenTimePopover, handleCloseTimePopover] =
    usePopover();
  const [timeDrawer, handleOpenTimeDrawer, handleCloseTimeDrawer] = useModal();
  const [addressModal, handleOpenAddressModal, handleCloseAddressModal] =
    useModal();

  const { delivery_date, delivery_time, address, location, for_someone } =
    formik.values;
  const isToday = dayjs(delivery_date).isSame(dayjs().format("YYYY-MM-DD"));
  const isTomorrow = dayjs(delivery_date).isSame(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );
  const day = dayjs(delivery_date).format("ddd");

  const openTimePicker = (event: any) => {
    if (checkIsDisabledDay(0, data)) {
      handleOpenTimeDrawer();
    } else {
      handleOpenTimePopover(event);
    }
  };

  const handleChangeDeliverySchedule = ({
    date,
    time,
  }: {
    date: string;
    time: string;
  }) => {
    formik.setFieldValue("delivery_time", time);
    formik.setFieldValue("delivery_date", date);
  };

  return (
    <>
      <div className={cls.row}>
        <button type="button" className={cls.rowBtn} onClick={openTimePicker}>
          <div className={cls.item}>
            <CalendarCheckLineIcon />
            <div className={cls.naming}>
              <div className={cls.label}>{t("delivery.time")}</div>
              <div className={cls.value}>
                {isToday ? t("today") : isTomorrow ? t("tomorrow") : day},{" "}
                {delivery_time}
              </div>
            </div>
          </div>
          <div className={cls.icon}>
            <PencilFillIcon />
          </div>
        </button>
        <button
          type="button"
          className={cls.rowBtn}
          onClick={handleOpenAddressModal}
        >
          <div className={cls.item}>
            <MapPinRangeFillIcon />
            <div className={cls.naming}>
              <div className={cls.label}>{t("delivery.address")}</div>
              <div className={cls.value}>{address?.address}</div>
            </div>
          </div>
          <div className={cls.icon}>
            <ArrowRightSLineIcon />
          </div>
        </button>
      </div>
      <div className={cls.form}>
        <div className={cls.flex}>
          <TextInput
            name="address.office"
            label={t("office")}
            value={formik.values.address?.office}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
          />
          <TextInput
            name="address.house"
            label={t("house")}
            value={formik.values.address?.house}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
          />
          <TextInput
            name="address.floor"
            label={t("floor")}
            value={formik.values.address?.floor}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
          />
        </div>
        <div className={cls.flex}>
          <TextInput
            label={t("phone")}
            placeholder={t("verify.your.phone")}
            disabled
            value={user?.phone}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row">
                    {!user?.phone ? (
                      <div className={cls.failed}>
                        <CloseLineIcon />
                      </div>
                    ) : (
                      <div className={cls.success}>
                        <CheckLineIcon />
                      </div>
                    )}
                    <IconButton onClick={onPhoneVerify} disableRipple>
                      <EditLineIcon />
                    </IconButton>
                  </Stack>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <TextInput
          name="note"
          label={t("comment")}
          value={formik.values.note}
          onChange={formik.handleChange}
          placeholder={t("type.here")}
        />
        <div className={cls.checkbox}>
          <CheckboxInput
            id="for_someone"
            name="for_someone"
            checked={formik.values.for_someone}
            onChange={formik.handleChange}
            value={formik.values.for_someone}
          />
          <label htmlFor="for_someone" className={cls.label}>
            {t("order.for.someone")}
          </label>
        </div>
        {!!for_someone && (
          <div className={`${cls.flex} ${cls.space}`}>
            <TextInput
              name="username"
              label={t("name")}
              value={formik.values.username}
              onChange={formik.handleChange}
              placeholder={t("type.here")}
            />
            <TextInput
              name="phone"
              label={t("phone")}
              value={formik.values.phone}
              onChange={formik.handleChange}
              placeholder={t("type.here")}
            />
          </div>
        )}
      </div>
      <DeliveryTimePopover
        open={timePopover}
        anchorEl={anchorEl}
        onClose={handleCloseTimePopover}
        weekDay={isToday ? t("today") : isTomorrow ? t("tomorrow") : day}
        time={data.delivery_time?.to || "0"}
        handleOpenDrawer={handleOpenTimeDrawer}
        formik={formik}
        timeType={data.delivery_time?.type || "minute"}
      />
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
      <DeliveryAddressModal
        open={addressModal}
        onClose={handleCloseAddressModal}
        latlng={location}
        address={address?.address || ""}
        fullScreen={!isDesktop}
        formik={formik}
        onSavedAddressSelect={(savedAddress) => {
          formik.setFieldValue(
            "address.floor",
            savedAddress?.address?.floor || ""
          );
          formik.setFieldValue(
            "address.office",
            savedAddress?.address?.entrance || ""
          );
          formik.setFieldValue("note", savedAddress?.address?.comment || "");
          formik.setFieldValue(
            "address.house",
            savedAddress?.address?.house || ""
          );
        }}
      />
    </>
  );
}
