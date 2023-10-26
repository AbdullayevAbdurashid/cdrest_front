import React from "react";
import RadioInput from "components/inputs/radioInput";
import cls from "./currencyList.module.scss";
import { Currency } from "interfaces";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { selectCurrency, setCurrency } from "redux/slices/currency";
import { useQuery } from "react-query";
import currencyService from "services/currency";

type Props = {
  onClose: () => void;
};

export default function CurrencyList({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const currency = useAppSelector(selectCurrency);

  const { data } = useQuery("currencies", () => currencyService.getAll());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currencyId = event.target.value;
    const activeCurrency = data?.data?.find(
      (item: Currency) => item.id === Number(currencyId)
    );
    dispatch(setCurrency(activeCurrency));
    onClose();
  };

  const controlProps = (item: string) => ({
    checked: String(currency?.id) === item,
    onChange: handleChange,
    value: item,
    id: item,
    name: "currency",
    inputProps: { "aria-label": item },
  });

  return (
    <div className={cls.wrapper}>
      {data?.data?.map((item: Currency) => (
        <div key={item.id} className={cls.row}>
          <RadioInput {...controlProps(String(item.id))} />
          <label className={cls.label} htmlFor={String(item.id)}>
            <span className={cls.text}>{item.symbol}</span>{" "}
            <span style={{ textTransform: "uppercase" }}>({item.title})</span>
          </label>
        </div>
      ))}
    </div>
  );
}
