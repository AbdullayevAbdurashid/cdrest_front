import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import RadioInput from "components/inputs/radioInput";
import cls from "./branchList.module.scss";
import PrimaryButton from "components/button/primaryButton";
import { IBranch, OrderFormValues } from "interfaces";
import SecondaryButton from "components/button/secondaryButton";
import { FormikProps } from "formik";
import Loader from "components/loader/loader";

type Props = {
  data: IBranch[];
  handleClose: () => void;
  formik?: FormikProps<OrderFormValues>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export default function BranchList({
  data,
  handleClose,
  formik,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const loader = useRef(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    id: item,
    name: "branch",
    inputProps: { "aria-label": item },
  });

  const clearValue = () => setSelectedValue("");

  const submit = () => {
    if (!selectedValue) {
      return;
    }
    const branch = data.find((item) => String(item.id) == selectedValue);
    formik?.setFieldValue("location", branch?.location);
    formik?.setFieldValue("address.address", branch?.address?.address);
    handleClose();
  };

  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver, hasNextPage, fetchNextPage]);

  return (
    <div className={cls.wrapper}>
      <div className={cls.body}>
        {data.map((item) => (
          <div key={item.id} className={cls.row}>
            <RadioInput {...controlProps(String(item.id))} />
            <label className={cls.label} htmlFor={String(item.id)}>
              <span className={cls.text}>{item.translation?.title}</span>
              <div className={cls.muted}>{item.address.address}</div>
            </label>
          </div>
        ))}
        {!data.length && <div>{t("branches.not.found")}</div>}
        {isFetchingNextPage && <Loader />}
        <div ref={loader} />
      </div>
      <div className={cls.footer}>
        <div className={cls.action}>
          <PrimaryButton onClick={submit}>{t("save")}</PrimaryButton>
        </div>
        <div className={cls.action}>
          <SecondaryButton onClick={clearValue}>{t("clear")}</SecondaryButton>
        </div>
      </div>
    </div>
  );
}
