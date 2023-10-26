/* eslint-disable @next/next/no-img-element */
import React, { useContext, useState } from "react";
import cls from "./productFilter.module.scss";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import brandService from "services/brand";
import { Skeleton } from "@mui/material";
import { IBrand } from "interfaces";
import RadioInput from "components/inputs/radioInput";
import SecondaryButton from "components/button/secondaryButton";
import DarkButton from "components/button/darkButton";

type Props = {
  open: boolean;
  handleClose: () => void;
};

interface Option {
  title: string;
  value: string;
}

const sortOptions: Option[] = [
  { title: "standard", value: "standard" },
  {
    title: "least.expensive",
    value: "price_asc",
  },
  {
    title: "expensive",
    value: "price_desc",
  },
];

export default function ProductFilter({ open, handleClose }: Props) {
  const { t } = useTranslation();
  const { query, replace } = useRouter();
  const [selectedSortOption, setSelectedSortOption] = useState(
    (query?.sort as string) || sortOptions[0].value
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    Array.isArray(query?.brands)
      ? query?.brands
      : query?.brands
      ? [query?.brands as string]
      : []
  );

  const { data: brands, isLoading: brandsLoading } = useQuery(
    ["brands", query?.category_id, query?.id],
    () =>
      brandService.getAll({
        category_id: query?.category_id,
        perPage: 100,
        shop_id: query?.id,
      }),
    {
      enabled: open,
    }
  );

  const handlSelectBrand = (brand: IBrand) => {
    if (selectedBrands.includes(brand.id.toString())) {
      setSelectedBrands(
        (oldBrands) =>
          oldBrands?.filter((oldBrand) => oldBrand !== brand.id.toString()) ||
          []
      );
    } else {
      setSelectedBrands((oldBrands) => [...oldBrands, brand.id.toString()]);
    }
  };

  const handleReset = () => {
    setSelectedSortOption(sortOptions[0].value);
    setSelectedBrands([]);
  };

  const handleShowResut = () => {
    const params: Record<string, string | undefined | string[]> = {
      id: query?.id,
    };
    if (query?.category_id) {
      params.category_id = query?.category_id;
    }
    if (query?.sub_category_id) {
      params.sub_category_id = query?.category_id;
    }
    if (selectedBrands.length > 0) {
      params.brands = selectedBrands;
    }
    if (selectedSortOption !== "standard") {
      params.sort = selectedSortOption;
    }
    replace({ query: params }, undefined, { shallow: true});
    handleClose();
  };

  const handleSortChange = (item: Option) => {
    setSelectedSortOption(item.value);
  };

  const controlProps = (item: Option) => ({
    checked: selectedSortOption == item.value,
    onChange: () => handleSortChange(item),
    value: item.value,
    id: item.value,
    name: "sort",
    inputProps: { "aria-label": item.value },
  });

  return (
    <div className={cls.wrapper}>
      <div className={cls.actions}>
        <h4 className={cls.title}>{t("show.first")}</h4>
        <div className={cls.sortGroup}>
          {sortOptions.map((item) => (
            <div key={item.value} className={cls.radioGroup}>
              <RadioInput {...controlProps(item)} />
              <label className={cls.label} htmlFor={item.value}>
                <span className={cls.text}>{t(item.title)}</span>
              </label>
            </div>
          ))}
        </div>
        {!brandsLoading && brands?.data.length !== 0 && (
          <>
            <h4 className={cls.title}>{t("brands")}</h4>
            <div className={cls.brandList}>
              {brandsLoading
                ? Array.from(Array(6).keys()).map((item) => (
                    <Skeleton
                      height={30}
                      variant="rounded"
                      key={item}
                      width={70}
                    />
                  ))
                : brands?.data.map((brand) => (
                    <button
                      onClick={() => handlSelectBrand(brand)}
                      className={`${cls.brandCard} ${
                        selectedBrands.includes(brand.id.toString())
                          ? cls.active
                          : ""
                      }`}
                      key={brand.id}
                    >
                      {brand.title}
                    </button>
                  ))}
            </div>
          </>
        )}
      </div>

      <div className={cls.footer}>
        <div className={cls.flex}>
          <DarkButton size="small" onClick={handleShowResut}>
            {t("show")}
          </DarkButton>
          {selectedBrands.length > 0 && (
            <SecondaryButton size="small" onClick={handleReset}>
              {t("clear")}
            </SecondaryButton>
          )}
        </div>
      </div>
    </div>
  );
}
