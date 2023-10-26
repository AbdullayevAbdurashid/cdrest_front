import React, { useEffect, useState } from "react";
import cls from "./extrasForm.module.scss";
import CustomCheckbox from "components/inputs/customCheckbox";
import { Addon } from "interfaces";
import Price from "components/price/price";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import AddFillIcon from "remixicon-react/AddFillIcon";

type Props = {
  data: Addon;
  quantity: number;
  selectedValues: SelectedItem[];
  handleChange: (item: any, count?: number) => void;
};

type SelectedItem = {
  id: string;
  quantity: number;
};

export default function AddonsItem({
  data,
  quantity,
  selectedValues,
  handleChange,
}: Props) {
  const checked = !!selectedValues.find((item) => item.id === String(data.id));
  const [counter, setCounter] = useState(checked ? quantity : 0);

  function reduceCounter() {
    setCounter((prev) => prev - 1);
  }

  function addCounter() {
    setCounter((prev) => prev + 1);
  }

  useEffect(() => {
    handleChange(data, counter);
  }, [counter]);

  if (data.product?.translation) {
    return (
      <div className={cls.checkboxGroup}>
        <CustomCheckbox
          id={String(data.id)}
          name={String(data.id)}
          checked={checked}
          onChange={(event) => setCounter(event.target.checked ? quantity : 0)}
        />
        {checked && (
          <div className={cls.counter}>
            <button
              className={cls.btn}
              disabled={counter === 0}
              onClick={reduceCounter}
            >
              <SubtractFillIcon />
            </button>
            <span className={cls.text}>{counter}</span>
            <span className={cls.symbol}> x </span>
            <button
              className={cls.btn}
              disabled={counter === data.product?.stock?.quantity}
              onClick={addCounter}
            >
              <AddFillIcon />
            </button>
          </div>
        )}
        <label className={cls.label} htmlFor={String(data.id)}>
          <span className={cls.text}>{data?.product?.translation.title}</span>
          <span className={cls.mute}>
            <Price number={data?.product?.stock?.total_price} plus />
          </span>
        </label>
      </div>
    );
  }
  return <div></div>;
}
