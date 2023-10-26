/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import GoogleMapReact, { Coords } from "google-map-react";
import cls from "./map.module.scss";
import { MAP_API_KEY } from "constants/constants";
import { getAddressFromLocation } from "utils/getAddressFromLocation";
import { IShop } from "interfaces";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import handleGooglePlacesPress from "utils/handleGooglePlacesPress";
import Price from "components/price/price";

const Marker = (props: any) => (
  <div className={cls.point}>
    <img src="/images/marker.png" width={32} alt="Location" />
  </div>
);
const ShopMarker = (props: any) => (
  <div className={cls.floatCard}>
    {props?.price && (
      <span className={cls.price}>
        <Price number={props.price} />
      </span>
    )}
    <div className={cls.marker}>
      <ShopLogoBackground data={props.shop} size="small" />
    </div>
  </div>
);

const options = {
  fields: ["address_components", "geometry"],
  types: ["address"],
};

type Props = {
  location: Coords;
  setLocation?: (data: any) => void;
  readOnly?: boolean;
  shop?: IShop;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  setAddress?: (data: any) => void;
  price?: number;
  drawLine?: boolean;
  defaultZoom?: number
};

export default function Map({
  location,
  setLocation = () => {},
  readOnly = false,
  shop,
  inputRef,
  setAddress,
  price,
  drawLine,
  defaultZoom = 15
}: Props) {
  const autoCompleteRef = useRef<any>();
  const [maps, setMaps] = useState<any>();
  const [map, setMap] = useState<any>();

  async function onChangeMap(map: any) {
    if (readOnly) {
      return;
    }
    const location = {
      lat: map.center.lat(),
      lng: map.center.lng(),
    };
    setLocation(location);
    const address = await getAddressFromLocation(
      `${location.lat},${location.lng}`
    );
    if (inputRef?.current?.value) inputRef.current.value = address;
    if (setAddress) setAddress(address);
  }

  const handleApiLoaded = (map: any, maps: any) => {
    autoComplete(map, maps);
    setMap(map);
    setMaps(maps);
    if (shop) {
      const shopLocation = {
        lat: Number(shop.location?.latitude) || 0,
        lng: Number(shop.location?.longitude) || 0,
      };
      const markers = [location, shopLocation];
      let bounds = new maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i]);
      }
      map.fitBounds(bounds);
    }
  };

  function autoComplete(map: any, maps: any) {
    if (inputRef) {
      autoCompleteRef.current = new maps.places.Autocomplete(
        inputRef.current,
        options
      );
      autoCompleteRef.current.addListener("place_changed", async function () {
        const place = await autoCompleteRef.current.getPlace();
        const address = handleGooglePlacesPress(place);
        const coords: Coords = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setLocation(coords);
        if (setAddress) setAddress(address);
      });
    }
  }

  useEffect(() => {
    if (shop && maps) {
      const shopLocation = {
        lat: Number(shop.location?.latitude) || 0,
        lng: Number(shop.location?.longitude) || 0,
      };
      const markers = [location, shopLocation];
      let bounds = new maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i]);
      }
      map.fitBounds(bounds);
    }
  }, [location, shop?.location, drawLine, map, maps]);

  return (
    <div className={cls.root}>
      {!readOnly && (
        <div className={cls.marker}>
          <img src="/images/marker.png" width={32} alt="Location" />
        </div>
      )}
      <GoogleMapReact
        bootstrapURLKeys={{
          key: MAP_API_KEY || "",
          libraries: ["places"],
        }}
        zoom={defaultZoom}
        center={location}
        onDragEnd={onChangeMap}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        options={{ fullscreenControl: readOnly }}
      >
        {readOnly && <Marker lat={location.lat} lng={location.lng} />}
        {!!shop && (
          <ShopMarker
            lat={shop.location?.latitude || 0}
            lng={shop.location?.longitude || 0}
            shop={shop}
            price={price}
          />
        )}
      </GoogleMapReact>
    </div>
  );
}
