import React from "react";
import cls from "./groupOrderCard.module.scss";
import PrimaryButton from "components/button/primaryButton";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import cartService from "services/cart";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import TextInput from "components/inputs/textInput";
import { useShop } from "contexts/shop/shop.context";
import { warning } from "components/alert/toast";

type Props = {
  handleClose: () => void;
};
interface formValues {
  name?: string;
}

export default function JoinGroupCard({ handleClose }: Props) {
  const { t } = useTranslation();
  const { query } = useRouter();
  const shopId = Number(query.id);
  const cartId = Number(query.g);
  const { setMemberData } = useShop();

  const { mutate: joinGroup, isLoading: isGroupLoading } = useMutation({
    mutationFn: (data: any) => cartService.join(data),
    onSuccess: (data) => {
      const payload = {
        uuid: data.data.uuid,
        cart_id: data.data.cart_id,
        shop_id: shopId,
      };
      setMemberData(payload);
      handleClose();
    },
    onError: () => {
      warning(t("you.cannot.join"));
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values: formValues) => {
      const payload = {
        name: values.name,
        shop_id: shopId,
        cart_id: cartId,
      };
      joinGroup(payload);
    },
    validate: (values: formValues) => {
      const errors: formValues = {};
      if (!values.name) {
        errors.name = t("required");
      }
      return errors;
    },
  });

  return (
    <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
      <div className={cls.header}>
        <h2 className={cls.title}>{t("join.group.order")}</h2>
        <p className={cls.text}>{t("join.group.text")}</p>
      </div>

      <div className={cls.actions}>
        <div style={{ flex: "1 0 100%" }}>
          <TextInput
            name="name"
            label={t("name")}
            placeholder={t("type.here")}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={!!formik.errors.name && formik.touched.name}
          />
        </div>
      </div>

      <div className={cls.footer}>
        <div className={cls.btnWrapper}>
          <PrimaryButton type="submit" loading={isGroupLoading}>
            {t("join")}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
