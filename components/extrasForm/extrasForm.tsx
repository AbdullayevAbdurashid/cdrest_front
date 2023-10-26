import React, { useState } from "react";
import RadioInput from "components/inputs/radioInput";
import cls from "./extrasForm.module.scss";
import { ProductExtra } from "interfaces";

type Props = {
  name: string;
  data: ProductExtra[];
  handleExtrasClick: (e: any) => void;
  stock: any;
  selectedExtra: ProductExtra;
};

export default function ExtrasForm({
  name,
  data,
  handleExtrasClick,
  stock,
  selectedExtra,
}: Props) {
  const [selectedValue, setSelectedValue] = useState(String(selectedExtra.id));

  const handleChange = (item: ProductExtra) => {
    setSelectedValue(String(item.id));
    handleExtrasClick(item);
  };

  const controlProps = (item: ProductExtra) => ({
    checked: selectedValue == String(item.id),
    onChange: () => handleChange(item),
    value: String(item.id),
    id: String(item.id),
    name,
    inputProps: { "aria-label": String(item.id) },
  });

  return (
    <div className={cls.extrasWrapper}>
      <h3 className={cls.extraTitle}>{name}</h3>
      <div className={cls.extraGroup}>
        {data.map((item) => (
          <div key={item.id} className={cls.radioGroup}>
            <RadioInput {...controlProps(item)} />
            <label className={cls.label} htmlFor={String(item.id)}>
              <span className={cls.text}>{item.value}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
