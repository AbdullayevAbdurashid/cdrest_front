import React, { useRef } from "react";
import cls from "./parcelForm.module.scss";
import { Grid, useMediaQuery } from "@mui/material";
import TextInput from "components/inputs/textInput";
import { FormikProps } from "formik";
import { ParcelFormValues, ParcelType } from "interfaces/parcel.interface";
import useLocale from "hooks/useLocale";
import PrimaryButton from "components/button/primaryButton";
import Price from "components/price/price";
import { useQuery } from "react-query";
import parcelService from "services/parcel";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import PencilFillIcon from "remixicon-react/PencilFillIcon";
import MapPinRangeLineIcon from "remixicon-react/MapPinRangeLineIcon";
import useModal from "hooks/useModal";
import DeliveryAddressModal from "components/addressModal/deliveryAddressModal";
import SwitchInput from "components/inputs/switchInput";
import TextArea from "components/inputs/textArea";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSettings } from "contexts/settings/settings.context";
import { error } from "components/alert/toast";

type Props = {
  formik: FormikProps<ParcelFormValues>;
  loading?: boolean;
  selectedType?: ParcelType;
};

export default function ParcelReceiverForm({
  formik,
  loading,
  selectedType,
}: Props) {
  const { t } = useLocale();
  const currency = useAppSelector(selectCurrency);
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const {
    username_to,
    phone_to,
    address_to,
    location_to,
    location_from,
    type_id,
    notify,
    description,
  } = formik.values;
  const [addressModal, handleOpenAddressModal, handleCloseAddressModal] =
    useModal();
  
  const {location} = useSettings();
  const defaultLocation = {
    latitude: location?.split(",")[0],
    longitude: location?.split(",")[1],
  }

  const { data: price, isLoading, isError } = useQuery(
    ["calculateParcel", location_from, location_to, type_id, currency],
    () =>
      parcelService.calculate({
        address_from: location_from,
        address_to: location_to,
        type_id,
        currency_id: currency?.id,
      }),
    {
      enabled: Boolean(type_id),
      select: (data) => data.data.price,
      onError: (e:any) => {
        error(e?.data?.message)
      }
    }
  );

  const handleAddToDescription = (value?: string) => {
    const oldDescription = description;
    if (!oldDescription || oldDescription?.trim().length === 0) {
      formik.setFieldValue("description", value);
      return;
    }
    formik.setFieldValue("description", `${oldDescription}, ${value}`);
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <button
            type="button"
            className={cls.rowBtn}
            onClick={handleOpenAddressModal}
          >
            <div className={cls.item}>
              <MapPinRangeLineIcon />
              <div className={cls.naming}>
                <div className={cls.label}>{t("address")}</div>
                <div className={cls.value}>{address_to}</div>
              </div>
            </div>
            <div className={cls.icon}>
              <PencilFillIcon />
            </div>
          </button>
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="phone_to"
            label={t("phone")}
            value={phone_to}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.phone_to && formik.touched.phone_to}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="username_to"
            label={t("username")}
            value={username_to}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.username_to && formik.touched.username_to}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="house_to"
            label={t("house")}
            value={formik.values.house_to}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.house_to && formik.touched.house_to}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="stage_to"
            label={t("stage")}
            value={formik.values.stage_to}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.stage_to && formik.touched.stage_to}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextInput
            name="room_to"
            label={t("room")}
            value={formik.values.room_to}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.room_to && formik.touched.room_to}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            name="instructions"
            label={t("add.instructions")}
            value={formik.values.instructions}
            onChange={formik.handleChange}
            placeholder={t("type.here")}
            error={!!formik.errors.instructions && formik.touched.instructions}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextArea
            label={t("item.description")}
            name="description"
            multiline
            sx={{".MuiInput-root": {marginTop: '2rem'}}}
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder={t("what.are.you.sending")}
            error={!!formik.errors.description && formik.touched.description}
          />
        </Grid>
        {selectedType?.options?.length !== 0 && (
          <Grid item xs={12}>
            <Swiper spaceBetween={10} slidesPerView="auto">
              {selectedType?.options?.map((option) => {
                const stringContains = description?.includes(
                  option.translation?.title || ""
                );
                return (
                  <SwiperSlide
                    className={cls.optionItemWrapper}
                    key={option.id}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToDescription(option.translation?.title)
                      }
                      disabled={stringContains}
                      className={`${cls.optionItem} ${
                        stringContains ? cls.active : ""
                      }`}
                    >
                      {option.translation?.title}
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Grid>
        )}
        <Grid item xs={12} md={8}>
          <TextArea
            name="qr_value"
            multiline
            value={formik.values.qr_value}
            onChange={formik.handleChange}
            placeholder={t("item.value.qr")}
            error={!!formik.errors.qr_value && formik.touched.qr_value}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <div className={cls.rowBtn}>
            <div className={cls.item}>
              <div className={cls.naming}>
                <div className={cls.value}>{t("remain.anonymus")}</div>
                <div className={cls.label}>{t("dont.notify.a.recipient")}</div>
              </div>
            </div>
            <div className={cls.switch}>
              <SwitchInput
                name="notify"
                checked={formik.values.notify}
                onChange={(e) =>
                  formik.setFieldValue("notify", e.target.checked)
                }
              />
              <div className={cls.value}>{notify ? t("on") : t("off")}</div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <PrimaryButton
            type="submit"
            disabled={!price || isError}
            loading={isLoading || loading}
          >
            {t("pay")} <Price number={price} />
          </PrimaryButton>
        </Grid>
      </Grid>
      <DeliveryAddressModal
        address={address_to}
        addressKey="address_to"
        locationKey="location_to"
        formik={formik}
        checkZone={false}
        open={addressModal}
        onClose={handleCloseAddressModal}
        latlng={location_to || defaultLocation}
        fullScreen={!isDesktop}
        title={"select.address"}
      />
    </>
  );
}
