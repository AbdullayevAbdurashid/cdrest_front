import React, { useEffect } from "react";
import cls from "./beSellerContainer.module.scss";
import i18n from "i18n";
import { useFormik } from "formik";
import { ShopFormType } from "interfaces";
import { useTranslation } from "react-i18next";
import { useAuth } from "contexts/auth/auth.context";
import { useSettings } from "contexts/settings/settings.context";
import { Grid, useMediaQuery } from "@mui/material";
import { useMutation } from "react-query";
import shopService from "services/shop";
import useModal from "hooks/useModal";
import { success, error } from "components/alert/toast";
import BeSellerModal from "components/beSellerModal/beSellerModal";
import { useRouter } from "next/router";
import ShopForm from "components/shopForm/shopForm";
import Unauthorized from "components/unauthorized/unauthorized";

type Props = {
  children: any;
};

export default function BeSellerContainer({ children }: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { user, refetchUser, isAuthenticated } = useAuth();
  const { address, location } = useSettings();
  const latlng = location;
  const [openWaitingModal, handleOpenWaitingModal, handleCloseWaitingModal] =
    useModal(Boolean(user?.shop));
  const { push } = useRouter();

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => shopService.create(data),
    onSuccess: () => {
      success(t("request.sent"));
      handleOpenWaitingModal();
      refetchUser();
    },
    onError: () => {
      error(t("error.400"));
    },
  });

  const formik = useFormik({
    initialValues: {
      price: undefined,
      price_per_km: undefined,
      title: {
        [i18n.language]: "",
      },
      categories: [],
      tags: [],
      phone: "",
      description: {
        [i18n.language]: "",
      },
      min_amount: undefined,
      tax: undefined,
      delivery_time_type: "minute",
      delivery_time_from: undefined,
      delivery_time_to: undefined,
      address: {
        [i18n.language]: address,
      },
      images: ["", ""],
      user_id: user?.id,
      location: latlng,
      type: "shop",
    },
    onSubmit: (values: ShopFormType) => {
      console.log("values => ", values);
      const body = {
        ...values,
        location: {
          latitude: latlng?.split(",")[0],
          longitude: latlng?.split(",")[1],
        },
        min_amount: String(values.min_amount),
      };
      mutate(body);
    },
    validate: (values: ShopFormType) => {
      const errors: Partial<ShopFormType> = {};
      const re = /^[\+]?[0-9\b]+$/;
      if (!values.images[0]) {
        errors.logo = t("required");
      }
      if (!values.images[1]) {
        errors.background = t("required");
      }
      if (!values.title[i18n.language]) {
        errors.title = t("required");
      }
      if (!values.phone) {
        errors.phone = t("required");
      } else if (!re.test(values.phone)) {
        errors.phone = t("invalid");
      }
      if (!values.description[i18n.language]) {
        errors.description = t("required");
      }
      if (!values.min_amount && values?.min_amount !== 0) {
        errors.min_amount = t("required");
      }
      if (!values.tax && values?.tax !== 0) {
        errors.tax = t("required");
      }
      if (!values.delivery_time_from) {
        errors.delivery_time_from = t("required");
      }
      if (!values.delivery_time_to) {
        errors.delivery_time_to = t("required");
      }
      if (!values.price) {
        errors.price = t("required");
      }
      if (!values.price_per_km) {
        errors.price_per_km = t("required");
      }
      if (!values.address[i18n.language]) {
        errors.address = t("required");
      }
      if (!values.categories.length) {
        errors.categories = t("required");
      }
      if (!values.tags.length) {
        errors.tags = t("required");
      }
      return errors;
    },
  });

  const closeModal = () => {
    push("/");
    handleCloseWaitingModal();
  };

  useEffect(() => {
    if(!openWaitingModal && user?.shop) {
      handleOpenWaitingModal()
    }
  }, [user?.shop])

  return (
    <div className={cls.root}>
      <div className={cls.container}>
        <div className="container">
          <div className={cls.header}>
            <h1 className={cls.title}>{t("be.seller")}</h1>
          </div>
        </div>
      </div>
      <div className="container">
        <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
          {!!user?.empty_p && (
            <div className={cls.alert}>{t("have.not.password")}</div>
          )}
          <Grid container spacing={isDesktop ? 4 : 1}>
            {isAuthenticated ? (
              React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                  formik,
                  lang: i18n.language,
                  loading: isLoading,
                });
              })
            ) : (
              <ShopForm xs={12} md={8}>
                <Unauthorized text={t("sign.in.be.seller")} />
              </ShopForm>
            )}
          </Grid>
        </form>
      </div>
      <BeSellerModal open={openWaitingModal} handleClose={closeModal} />
    </div>
  );
}
