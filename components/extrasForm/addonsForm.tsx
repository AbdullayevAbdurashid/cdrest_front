import React, { useCallback, useEffect, useState } from "react";
import cls from "./extrasForm.module.scss";
import { Addon } from "interfaces";
import { useTranslation } from "react-i18next";
import useDidUpdate from "hooks/useDidUpdate";
import AddonsItem from "./addonsItem";

type Props = {
  data: Addon[];
  handleAddonClick: (e: any) => void;
  quantity: number;
  selectedAddons: SelectedItem[];
  onSelectAddon: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
};

type SelectedItem = {
  id: string;
  quantity: number;
};

export default function AddonsForm({
  data = [],
  handleAddonClick,
  quantity,
  selectedAddons,
  onSelectAddon,
}: Props) {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (item: Addon, count?: number) => {
      const value = String(item.id);
      if (!count) {
        onSelectAddon((prev) => prev.filter((el) => el.id !== value));
      } else {
        const newValues = [...selectedAddons];
        const idx = newValues.findIndex((el) => el.id == value);
        if (idx < 0) {
          newValues.push({
            id: value,
            quantity: count,
          });
        } else {
          newValues[idx].quantity = count;
        }
        onSelectAddon(newValues);
      }
    },
    [selectedAddons]
  );

  useDidUpdate(() => {
    let addons: any[] = [];

    selectedAddons.forEach((item) => {
      const element = data.find((el) => String(el.id) == item.id);
      if (!element) {
        addons = [];
        return;
      }
      const addon = {
        ...element.product,
        stock: { ...element.product?.stock, quantity: item.quantity },
      };
      addons.push(addon);
    });

    handleAddonClick(addons);
  }, [selectedAddons]);

  return (
    <div
      className={cls.extrasWrapper}
      style={{ display: data.length > 0 ? "block" : "none" }}
    >
      <h3 className={cls.extraTitle}>{t("ingredients")}</h3>
      <div className={cls.extraGroup}>
        {data
          .filter((item) => !!item.product)
          .map((item) => (
            <AddonsItem
              key={item.id + "addon"}
              data={item}
              quantity={item.product?.min_qty || 1}
              selectedValues={selectedAddons}
              handleChange={handleChange}
            />
          ))}
      </div>
    </div>
  );
}
