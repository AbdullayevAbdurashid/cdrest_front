import { Stack } from "@mui/material";
import { IAddress } from "interfaces/address.interface";
import React from "react";
import MapPinRangeLineIcon from "remixicon-react/MapPinRangeLineIcon";
import cls from "./addressModal.module.scss";

export default function AddressCard({
  address,
  selectedAddress,
  onClick,
}: {
  address: IAddress;
  selectedAddress: IAddress | null;
  onClick: (address: IAddress) => void;
}) {
  return (
    <button
      className={`${cls.addressButton} ${
        address.id === selectedAddress?.id ? cls.buttonActive : ""
      }`}
      onClick={() => onClick(address)}
    >
      <div className={cls.location}>
        <MapPinRangeLineIcon />
      </div>
      <Stack alignItems="flex-start">
        <div className={cls.addressTitle}>{address.title}</div>
        <span className={cls.address}>{address.address?.address}</span>
      </Stack>
    </button>
  );
}
