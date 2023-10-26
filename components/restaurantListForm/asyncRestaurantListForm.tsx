import React, { useState } from "react";
import RadioInput from "components/inputs/radioInput";
import cls from "./restaurantListForm.module.scss";
import DarkButton from "components/button/darkButton";
import { Skeleton } from "@mui/material";
import { useQuery } from "react-query";
import useLocale from "hooks/useLocale";
import shopService from "services/shop";
import qs from "qs";
import Image from "next/image";

interface Props {
  handleSubmit: (id: string) => void;
  branchId?: number;
}

export default function AsyncBranchListForm({ handleSubmit, branchId }: Props) {
  const { t, locale } = useLocale();
  const [selectedValue, setSelectedValue] = useState<string>(String(branchId));

  const { data, isLoading } = useQuery(["branches", locale], () =>
    shopService.getAll(qs.stringify({ page: 1, perPage: 100, open: 1, has_section: 1 }))
  );

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

  return (
    <>
      <div className={cls.wrapper}>
        <div className={cls.body}>
          {!isLoading
            ? data?.data.map((item) => (
                <div key={item.id} className={cls.row}>
                  <RadioInput {...controlProps(String(item.id))} />
                  <label className={cls.label} htmlFor={String(item.id)}>
                    <div className={cls.content}>
                      <Image src={item.logo_img || ""} alt={item.translation.title} width={50} height={50} className={cls.img} />
                      <div className={cls.main}>

                    <span className={cls.text}>{item.translation?.title}</span>
                    <div className={cls.muted}>{item.translation?.address}</div>
                      </div>
                    </div>
                  </label>
                </div>
              ))
            : Array.from(new Array(2)).map((item, idx) => (
                <Skeleton
                  key={"branches" + idx}
                  variant="rectangular"
                  className={cls.shimmer}
                />
              ))}

          {!data?.data.length && !isLoading && (
            <div>{t("branches.not.found")}</div>
          )}
        </div>
        <div className={cls.footer}>
          <div className={cls.action}>
            <DarkButton onClick={() => handleSubmit(selectedValue)}>
              {t("submit")}
            </DarkButton>
          </div>
        </div>
      </div>
    </>
  );
}
