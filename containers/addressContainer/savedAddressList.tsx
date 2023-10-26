import { IAddress } from "interfaces/address.interface";
import React from "react";
import cls from "./addressContainer.module.scss";
import { useSettings } from "contexts/settings/settings.context";
import RadioInput from "components/inputs/radioInput";
import { useTranslation } from "react-i18next";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import addressService from "services/address";
import PlusIcon from 'remixicon-react/AddLineIcon'
import EqualizerFillIcon from "remixicon-react/EqualizerFillIcon";

type Props = {
  handleOpenAddressModal: () => void;
  addresses?: IAddress[];
  handleCloseList: () => void;
  onSelectAddress: (value: IAddress) => void;
};

export default function SavedAddressList({
  handleOpenAddressModal,
  addresses,
  handleCloseList,
  onSelectAddress,
}: Props) {
  const { t } = useTranslation();
  const { updateAddress, updateLocation, updateLocationId } =
    useSettings();
  const queryClient = useQueryClient();
  const handleChange = (item: IAddress) => {
    updateAddress(item.address?.address);
    updateLocation(item.location.join(","));
    updateLocationId(item.id.toString());
  };

  const controlProps = (item: IAddress) => ({
    checked: Boolean(item.active),
    onChange: () => {
      handleChange(item);
      setActive(item.id);
      handleCloseList();
    },
    value: String(item.id),
    id: String(item.id),
    name: "addrss",
    inputProps: { "aria-label": String(item.id) },
  });

  const { mutate: setActive } = useMutation({
    mutationFn: (id: number) => addressService.setDefault(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries("addresses");
      const prevAddresses = queryClient.getQueryData<IAddress[]>("addresses");

      queryClient.setQueryData<IAddress[] | undefined>("addresses", (old) => {
        if (!old) return prevAddresses;
        return old
          .flatMap((addressList) => addressList)
          .map((oldAddress) => {
            if (oldAddress.id === id) {
              updateAddress(oldAddress.address?.address);
              updateLocation(
                `${oldAddress.location.at(0)},${oldAddress.location.at(1)}`
              );
              return { ...oldAddress, active: true };
            }
            return { ...oldAddress, active: false };
          });
      });
    },
  });

  return (
    <div className={cls.addressWrapper}>
      <div className={cls.list}>
        {addresses?.map((item) => (
          <div key={item.id} className={cls.radioGroup}>
            <div className={cls.radio}>
              <RadioInput {...controlProps(item)} />
              <label className={cls.label} htmlFor={String(item.id)}>
                <div className={`${cls.text} ${!item.title && cls.twoLine}`}>{item.title ? item.title : item.address?.address}</div>
                {item.title && 
                <div className={`${cls.text} ${cls.desc}`}>
                  {item.address?.address}
                </div>
                }
              </label>
            </div>
            <button onClick={() => onSelectAddress(item)} className={cls.edit}>
              <EqualizerFillIcon size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          handleOpenAddressModal();
          handleCloseList();
        }}
        className={cls.add}
      >
        <PlusIcon /> <span>{t("add.address")}</span>
      </button>
    </div>
  );
}
