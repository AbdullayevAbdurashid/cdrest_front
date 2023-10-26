import { IAddress } from "interfaces/address.interface";
import React from "react";
import cls from "./savedLocationCard.module.scss";
import EqualizerFillIcon from "remixicon-react/EqualizerFillIcon";
import MapPin2LineIcon from "remixicon-react/MapPin2LineIcon";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";

export default function SavedLocationCard({
  address,
  onSelectAddress,
}: {
  address: IAddress;
  onSelectAddress: (value: IAddress) => void;
}) {
  return (
    <div className={`${cls.wrapper}`}>
      <div className={cls.body}>
        <div className={`${cls.badge} ${address.active ? cls.active : ""}`}>
          {!address.active ? <MapPin2LineIcon /> : <CheckDoubleLineIcon />}
        </div>
        <div className={cls.content}>
          <h3 className={cls.title}>{address.title}</h3>
          <p className={cls.text}>{address.address?.address}</p>
        </div>
      </div>
      <button onClick={() => onSelectAddress(address)} className={cls.action}>
        <EqualizerFillIcon size={16} />
      </button>
    </div>
  );
}
