//@ts-nocheck
import React, { useMemo } from "react";
import SEO from "components/seo";
import BeSellerContainer from "containers/beSeller/beSellerContainer";
import ShopForm from "components/shopForm/shopForm";
import ShopGeneralForm from "components/shopForm/shopGeneralForm";
import { useTranslation } from "react-i18next";
import ShopDeliveryForm from "components/shopForm/shopDeliveryForm";
import ShopAddressForm from "components/shopForm/shopAddressForm";
import { useQuery } from "react-query";
import categoryService from "services/category";
import shopService from "services/shop";
import { Category } from "interfaces";

interface ListType {
  label: string;
  value: number;
  parent?: ListType;
}

type Props = {};
const formatCategories = (list: Category[] = []) => {
  const res: ListType[] = [];
  if (!list.length) {
    return [];
  }
  list.forEach((item) => {
    res.push({ label: item.translation?.title, value: item.id });
    item.children?.map((child) => {
      res.push({
        label: child.translation?.title,
        value: child.id,
        parent: { label: item.translation?.title, value: item.id },
      });
    });
  });
  return res;
};

export default function BeSeller({}: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const { data: shopCategories } = useQuery(["shopCategories", locale], () =>
    categoryService.getAllShopCategories({ perPage: 100 })
  );
  const { data: tags } = useQuery("tags", () => shopService.getAllTags());

  const formattedCategories = useMemo(
    () => formatCategories(shopCategories?.data),
    [shopCategories?.data]
  );

  return (
    <>
      <SEO />
      <BeSellerContainer>
        <ShopForm title={t("general")} xs={12} md={8}>
          <ShopGeneralForm
            shopCategories={formattedCategories}
            tagList={formatCategories(tags?.data)}
          />
        </ShopForm>
        <ShopForm title={t("delivery.info")} xs={12} md={4}>
          <ShopDeliveryForm />
        </ShopForm>
        <ShopForm title={t("address")} xs={12}>
          <ShopAddressForm />
        </ShopForm>
      </BeSellerContainer>
    </>
  );
}
