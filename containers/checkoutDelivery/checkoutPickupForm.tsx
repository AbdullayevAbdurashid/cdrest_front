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
import Map from "components/map/map";
import { useInfiniteQuery } from "react-query";
import branchService from "services/branch";
import BranchList from "components/branchList/branchList";
import { useAuth } from "contexts/auth/auth.context";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import CheckLineIcon from "remixicon-react/CheckLineIcon";
import EditLineIcon from "remixicon-react/EditLineIcon";

const DeliveryTimes = dynamic(
  () => import("components/deliveryTimes/deliveryTimes")
);
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));
const DeliveryTimePopover = dynamic(
  () => import("components/deliveryTimePopover/deliveryTimePopover")
);
const ModalContainer = dynamic(() => import("containers/modal/modal"));
const DrawerContainer = dynamic(() => import("containers/drawer/drawer"));

type Props = {
  data: IShop;
  formik: FormikProps<OrderFormValues>;
  onPhoneVerify: () => void;
};

export default function CheckoutPickupForm({
  formik,
  data,
  onPhoneVerify,
}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { user } = useAuth();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const [timePopover, anchorEl, handleOpenTimePopover, handleCloseTimePopover] =
    usePopover();
  const [timeDrawer, handleOpenTimeDrawer, handleCloseTimeDrawer] = useModal();
  const [branchDrawer, handleOpenBranchDrawer, handleCloseBranchDrawer] =
    useModal();

  const { delivery_date, delivery_time, address, location } = formik.values;
  const isToday = dayjs(delivery_date).isSame(dayjs().format("YYYY-MM-DD"));
  const isTomorrow = dayjs(delivery_date).isSame(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );
  const day = dayjs(delivery_date).format("ddd");

  const branchLocation = {
    lat: Number(location?.latitude) || 0,
    lng: Number(location?.longitude) || 0,
  };

  const {
    data: branches,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["branches", locale, data?.id],
    ({ pageParam = 1 }) =>
      branchService.getAll({ shop_id: data?.id, page: pageParam, perPage: 10 }),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.meta?.current_page < lastPage.meta?.last_page) {
          return lastPage.meta?.current_page + 1;
        }
        return undefined;
      },
    }
  );

  if (error) {
    console.log("error => ", error);
  }

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
              <div className={cls.label}>{t("pickup.time")}</div>
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
          onClick={handleOpenBranchDrawer}
        >
          <div className={cls.item}>
            <MapPinRangeFillIcon />
            <div className={cls.naming}>
              <div className={cls.label}>{t("pickup.address")}</div>
              <div className={cls.value}>{address?.address}</div>
            </div>
          </div>
          <div className={cls.icon}>
            <ArrowRightSLineIcon />
          </div>
        </button>
      </div>
      <div className={cls.map}>
        <Map location={branchLocation} readOnly />
      </div>
      <div className={cls.form}>
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
      </div>

      <DeliveryTimePopover
        open={timePopover}
        anchorEl={anchorEl}
        onClose={handleCloseTimePopover}
        weekDay={isToday ? t("today") : isTomorrow ? t("tomorrow") : day}
        time={data?.delivery_time?.to || "0"}
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

      {isDesktop ? (
        <DrawerContainer
          title={t("branches")}
          open={branchDrawer}
          onClose={handleCloseBranchDrawer}
        >
          <BranchList
            data={branches?.pages?.flatMap((item) => item.data) || []}
            handleClose={handleCloseBranchDrawer}
            formik={formik}
            fetchNextPage={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </DrawerContainer>
      ) : (
        <MobileDrawer
          title={t("branches")}
          open={branchDrawer}
          onClose={handleCloseBranchDrawer}
        >
          <BranchList
            data={branches?.pages?.flatMap((item) => item.data) || []}
            handleClose={handleCloseBranchDrawer}
            formik={formik}
            fetchNextPage={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </MobileDrawer>
      )}
    </>
  );
}
