import SEO from "components/seo";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import informationService from "services/information";
import createSettings from "utils/createSettings";
import { getCookie } from "utils/session";

const uiTypes = {
  "1": dynamic(() => import("containers/shops/shopsPage")),
  "2": dynamic(() => import("containers/shops/v2")),
  "3": dynamic(() => import("containers/shops/v3")),
  "4": dynamic(() => import("containers/shops/v4"))
};

type PageProps = {
  uiType?: keyof typeof uiTypes;
};

export default function Shops({ uiType = "1" }: PageProps) {
  const Ui = uiTypes[uiType] || uiTypes["1"];

  return (
    <>
      <SEO />
      <Ui />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const settingsData = await informationService.getSettings();
  const obj = createSettings(settingsData?.data);

  return {
    props: {
      uiType: obj?.ui_type,
    },
  };
};
