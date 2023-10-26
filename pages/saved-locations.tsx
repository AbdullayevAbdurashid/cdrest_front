import SEO from "components/seo";
import SavedLocationsContainer from "containers/savedLocationsContainer/savedLocationsContainer";
import { GetServerSideProps } from "next";
import React, {  useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  dehydrate,
  QueryClient,
  useQuery,
} from "react-query";
import addressService from "services/address";

export default function SavedLocations() {
  const { t } = useTranslation();

  const loader = useRef(null);

  const { data, isLoading } = useQuery("addresses", () =>
    addressService.getAll({
      perPage: 100,
    })
  );

  return (
    <>
      <SEO title={t("help.center")} />
      <SavedLocationsContainer
        data={data}
        loading={isLoading}
      ></SavedLocationsContainer>
      <div ref={loader} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery("addresses", () =>
    addressService.getAll({ perPage: 10 })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
