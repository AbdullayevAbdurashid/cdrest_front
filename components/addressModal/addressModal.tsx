import React, { useRef, useState } from "react";
import ModalContainer from "containers/modal/modal";
import { DialogProps, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import cls from "./addressModal.module.scss";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import DarkButton from "components/button/darkButton";
import Map from "components/map/map";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import { useSettings } from "contexts/settings/settings.context";
import TextInput from "components/inputs/textInput";
import { useFormik } from "formik";
import CompassDiscoverLineIcon from "remixicon-react/CompassDiscoverLineIcon";
import { getAddressFromLocation } from "utils/getAddressFromLocation";
import shopService from "services/shop";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useAuth } from "contexts/auth/auth.context";
import { AddressCreateData, IAddress } from "interfaces/address.interface";
import addressService from "services/address";
import { error, success } from "components/alert/toast";
import SecondaryButton from "components/button/secondaryButton";

interface Props extends DialogProps {
  address?: string;
  latlng: string;
  editedAddress: IAddress | null;
  onClearAddress: () => void;
}
interface formValues {
  entrance?: string;
  floor?: string;
  apartment?: string;
  comment?: string;
  title?: string;
}

export default function AddressModal({
  address,
  latlng,
  editedAddress,
  onClearAddress,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { updateAddress, updateLocation, location_id, updateLocationId} = useSettings();
  const [location, setLocation] = useState({
    lat: Number(latlng.split(",")[0]),
    lng: Number(latlng.split(",")[1]),
  });
  const inputRef = useRef<any>();
  const { isSuccess } = useQuery(["shopZones", location], () =>
    shopService.checkZone({
      address: { latitude: location.lat, longitude: location.lng },
    })
  );

  const queryClient = useQueryClient();
  const { mutate: createAddress, isLoading: createLoading } = useMutation({
    mutationFn: (data: AddressCreateData) => addressService.create(data),
  });

  const { mutate: updateUserAddress, isLoading: updateLoading } = useMutation({
    mutationFn: (data: AddressCreateData) =>
      addressService.update(editedAddress?.id || 0, data),
  });

  const { mutate: deleteAddress, isLoading: isDeleting } = useMutation({
    mutationFn: (id: number) => addressService.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries("addresses");
      const prevAddresses = queryClient.getQueryData<IAddress[]>("addresses");

      queryClient.setQueryData<IAddress[] | undefined>("addresses", (old) => {
        if (!old) return prevAddresses;
        return old
          .flatMap((addressList) => addressList)
          .filter((oldAddress) => oldAddress.id !== id);
      });
      return { prevAddresses };
    },
    onError: (error, vars, context) => {
      queryClient.setQueryData("addresses", context?.prevAddresses);
    },
    onSettled: () => {
      if (rest.onClose) rest.onClose({}, "backdropClick");
    },
  });

  function submitAddress(values: formValues) {
    if (!!editedAddress) {
      updateUserAddress(
        {
          title: values.title,
          location: [location.lat, location.lng],
          address: {
            address: inputRef.current?.value || "",
            floor: values.floor,
            house: values.apartment,
            entrance: values.entrance,
            comment: values.comment || ""
          },
          active: editedAddress.active,
        },
        {
          onSuccess: () => {
            success(t("successfully.updated"));
            queryClient.invalidateQueries("addresses");
          },
          onError: () => {
            error(t("unable.to.save"));
          },
          onSettled: () => {
            if (location_id === editedAddress?.id.toString()) {
              updateAddress(inputRef.current?.value);
              updateLocation(`${location.lat},${location.lng}`);
            }
            if (rest.onClose) rest.onClose({}, "backdropClick");
          },
        }
      );
      return;
    }
    if (user) {
      createAddress(
        {
          title: values.title,
          location: [location.lat, location.lng],
          address: {
            address: inputRef.current?.value || "",
            floor: values.floor,
            house: values.apartment,
            entrance: values.entrance,
            comment: values.comment
          },
          active: 1,
        },
        {
          onSuccess: (res) => {
            success(t("successfully.saved"));
            queryClient.invalidateQueries("addresses");
            updateLocationId(res.id.toString())
          },
          onError: () => {
            error(t("unable.to.save"));
          },
          onSettled: () => {
            updateAddress(inputRef.current?.value);
            updateLocation(`${location.lat},${location.lng}`);
            if (rest.onClose) rest.onClose({}, "backdropClick");
          },
        }
      );
    } else {
      updateAddress(inputRef.current?.value);
      updateLocation(`${location.lat},${location.lng}`);
      if (rest.onClose) rest.onClose({}, "backdropClick");
    }
  }

  const formik = useFormik({
    initialValues: {
      entrance: editedAddress?.address?.entrance,
      floor: editedAddress?.address?.floor || "",
      apartment: editedAddress?.address?.house || "",
      comment: editedAddress?.address?.comment,
      title: editedAddress?.title,
    },
    onSubmit: (values: formValues, { setSubmitting }) => {
      submitAddress(values);
    },
    validate: (values: formValues) => {
      const errors: formValues = {};
      return errors;
    },
  });

  function defineAddress() {
    window.navigator.geolocation.getCurrentPosition(
      defineLocation,
      console.log
    );
  }

  async function defineLocation(position: any) {
    const { coords } = position;
    let latlng: string = `${coords.latitude},${coords.longitude}`;
    const addr = await getAddressFromLocation(latlng);
    if (inputRef.current) inputRef.current.value = addr;
    const locationObj = {
      lat: coords.latitude,
      lng: coords.longitude,
    };
    setLocation(locationObj);
  }

  return (
    <ModalContainer {...rest}>
      <div className={cls.wrapper}>
        <div className={cls.header}>
          <h1 className={cls.title}>{t("enter.delivery.address")}</h1>
          <div className={cls.flex}>
            <div className={cls.search}>
              <label htmlFor="search">
                <Search2LineIcon />
              </label>
              <input
                type="text"
                id="search"
                name="search"
                ref={inputRef}
                placeholder={t("search")}
                autoComplete="off"
                defaultValue={address}
              />
            </div>
            <div className={cls.btnWrapper}>
              <DarkButton onClick={defineAddress}>
                <CompassDiscoverLineIcon />
              </DarkButton>
            </div>
          </div>
        </div>
        <div className={cls.body}>
          <Map
            location={location}
            setLocation={setLocation}
            inputRef={inputRef}
          />
        </div>
        <div className={cls.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextInput
                name="title"
                label={t("title")}
                placeholder={t("type.here")}
                value={formik.values.title}
                onChange={formik.handleChange}
                error={!!formik.errors.title && !!formik.touched.title}
              />
            </Grid>
            <Grid item xs={4}>
              <TextInput
                name="entrance"
                label={t("entrance")}
                placeholder={t("type.here")}
                value={formik.values.entrance}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextInput
                name="floor"
                label={t("floor")}
                placeholder={t("type.here")}
                value={formik.values.floor}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextInput
                name="apartment"
                label={t("apartment")}
                placeholder={t("type.here")}
                value={formik.values.apartment}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                name="comment"
                label={t("comment")}
                placeholder={t("type.here")}
                value={formik.values.comment}
                onChange={formik.handleChange}
              />
            </Grid>
            {editedAddress && location_id !== editedAddress.id.toString() && (
              <Grid item xs={6}>
                <SecondaryButton
                  type="button"
                  loading={isDeleting}
                  onClick={() => deleteAddress(editedAddress.id)}
                >
                  {t("delete.address")}
                </SecondaryButton>
              </Grid>
            )}
            <Grid
              item
              xs={
                !!editedAddress && location_id !== editedAddress.id.toString()
                  ? 6
                  : 12
              }
            >
              <DarkButton
                type="button"
                loading={createLoading || updateLoading}
                onClick={() => formik.submitForm()}
                disabled={!isSuccess}
              >
                {isSuccess ? t("submit") : t("delivery.zone.not.available")}
              </DarkButton>
            </Grid>
          </Grid>
        </div>
        <div className={cls.footer}>
          <button
            className={cls.circleBtn}
            onClick={(event) => {
              if (rest.onClose) rest.onClose(event, "backdropClick");
            }}
          >
            <ArrowLeftLineIcon />
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}
