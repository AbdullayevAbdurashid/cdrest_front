import React from "react";
import SEO from "components/seo";
import ReferralContainer from "containers/referralContainer/referralContainer";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import informationService from "services/information";

type Props = {};

export default function Referrals({}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const { data, isLoading } = useQuery(["referrals", locale], () =>
    informationService.getReferrals()
  );

  return (
    <>
      <SEO title={t("referrals")} />
      <ReferralContainer data={data?.data} loading={isLoading} />
    </>
  );
}
