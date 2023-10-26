import { Grid, Skeleton, Stack, useMediaQuery } from "@mui/material";
import SavedLocationCard from "components/savedLocationCard/savedLocationCard";
import { IAddress } from "interfaces/address.interface";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import cls from "./savedLocationsContainer.module.scss";
import dynamic from "next/dynamic";

const AddressModal = dynamic(
  () => import("components/addressModal/addressModal")
);

type Props = {
  data?: IAddress[];
  loading?: boolean;
  active?: boolean;
};

export default function SavedLocationsContainer({
  data,
  loading,
  active,
}: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);

  return (
    <section className="white-bg">
      <div className="container">
        <div className={cls.container}>
          <div className={cls.header}>
            <h2 className={cls.title}>{t("saved.locations")}</h2>
          </div>
          <Stack spacing={2}>
            {!loading
              ? data?.map((item) => (
                  <SavedLocationCard
                    key={item.id}
                    onSelectAddress={(value) => setSelectedAddress(value)}
                    address={item}
                  />
                ))
              : Array.from(new Array(4)).map((item, idx) => (
                  <Skeleton
                    key={item}
                    variant="rectangular"
                    className={cls.shimmer}
                  />
                ))}
          </Stack>
        </div>
        {!!selectedAddress && (
          <AddressModal
            open={!!selectedAddress}
            onClose={() => {
              setSelectedAddress(null);
            }}
            latlng={selectedAddress?.location.join(",")}
            address={selectedAddress?.address?.address}
            fullScreen={!isDesktop}
            editedAddress={selectedAddress}
            onClearAddress={() => setSelectedAddress(null)}
          />
        )}
      </div>
    </section>
  );
}
