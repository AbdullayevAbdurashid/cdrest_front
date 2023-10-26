import React, { useRef, useState } from "react";
import ModalContainer from "containers/modal/modal";
import { DialogProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import cls from "./addressModal.module.scss";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import DarkButton from "components/button/darkButton";
import Map from "components/map/map";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import CompassDiscoverLineIcon from "remixicon-react/CompassDiscoverLineIcon";
import { getAddressFromLocation } from "utils/getAddressFromLocation";
import { Location } from "interfaces";
import { FormikProps } from "formik";
import { useQuery } from "react-query";
import shopService from "services/shop";
import { useRouter } from "next/router";
import addressService from "services/address";
import { IAddress } from "interfaces/address.interface";
import { Swiper, SwiperSlide } from "swiper/react";
import AddressCard from "./addressCard";
import { useAuth } from "contexts/auth/auth.context";

interface Props<T> extends DialogProps {
  address: string;
  latlng: Location;
  formik?: FormikProps<T>;
  addressKey?: string;
  locationKey?: string;
  checkZone?: boolean;
  onSavedAddressSelect?: (address: IAddress | null) => void
}

export default function DeliveryAddressModal<T>({
  address,
  latlng,
  formik,
  addressKey = "address.address",
  locationKey = "location",
  checkZone = true,
  title,
  onSavedAddressSelect,
  ...rest
}: Props<T>) {
  const { t } = useTranslation();
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [location, setLocation] = useState({
    lat: Number(latlng.latitude),
    lng: Number(latlng.longitude),
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const { query } = useRouter();
  const shopId = Number(query.id);
  const { user } = useAuth();

  const { data: addresses } = useQuery(
    "addresses",
    () => addressService.getAll({ perPage: 100 }),
    {
      enabled: Boolean(user),
    }
  );

  const { isSuccess } = useQuery(
    ["shopZone", location],
    () =>
      shopService.checkZoneById(shopId, {
        address: { latitude: location.lat, longitude: location.lng },
      }),
    {
      enabled: checkZone,
    }
  );

  function submitAddress() {
    formik?.setFieldValue(addressKey, inputRef.current?.value);
    formik?.setFieldValue(locationKey, {
      latitude: location.lat,
      longitude: location.lng,
    });
    if (rest.onClose) rest.onClose({}, "backdropClick");
  }

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
    if (inputRef.current?.value) inputRef.current.value = addr;
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
          <h1 className={cls.title}>{t(title || "enter.delivery.address")}</h1>
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
        {addresses?.length !== 0 && (
          <div className={cls.addressList}>
            <Swiper slidesPerView="auto" spaceBetween={10}>
              {addresses?.map((addressItem) => (
                <SwiperSlide
                  style={{ width: "max-content" }}
                  key={addressItem.id}
                >
                  <AddressCard
                    selectedAddress={selectedAddress}
                    onClick={(newAddress) => {
                      setSelectedAddress(newAddress);
                      setLocation({
                        lat: Number(newAddress.location.at(0)),
                        lng: Number(newAddress.location.at(1)),
                      });
                      !!onSavedAddressSelect && onSavedAddressSelect(newAddress);
                      if (inputRef.current) {
                        inputRef.current.value = newAddress.address
                          ?.address as string;
                      }
                    }}
                    address={addressItem}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        <div className={cls.body}>
          <Map
            location={location}
            setLocation={(value) => {
              setLocation(value);
              setSelectedAddress(null);
              !!onSavedAddressSelect && onSavedAddressSelect(null);
            }}
            inputRef={inputRef}
          />
        </div>
        <div className={cls.form}>
          <DarkButton
            type="button"
            onClick={submitAddress}
            disabled={!isSuccess && checkZone}
          >
            {isSuccess || !checkZone
              ? t("submit")
              : t("delivery.zone.not.available")}
          </DarkButton>
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
