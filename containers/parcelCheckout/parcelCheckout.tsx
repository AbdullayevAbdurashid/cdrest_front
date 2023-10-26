import React, { useState } from "react";
import cls from "./parcelCheckout.module.scss";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useAuth } from "contexts/auth/auth.context";
import { useSettings } from "contexts/settings/settings.context";
import { Grid, useMediaQuery } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { error } from "components/alert/toast";
import { useRouter } from "next/router";
import ShopForm from "components/shopForm/shopForm";
import Unauthorized from "components/unauthorized/unauthorized";
import parcelService from "services/parcel";
import { ParcelFormValues, ParcelType } from "interfaces/parcel.interface";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import paymentService from "services/payment";

type Props = {
  children: any;
};

export default function ParcelCheckoutContainer({ children }: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { isAuthenticated, user } = useAuth();
  const { address, location } = useSettings();
  const latlng = location;
  const { push } = useRouter();
  const currency = useAppSelector(selectCurrency);
  const [selectedType, setSelectedType] = useState<ParcelType | undefined>();

  const handleSelectType = (value: ParcelType) => {
    setSelectedType(value);
  };

  const { data: payments } = useQuery("payments", () =>
    paymentService.getAll()
  );

  const formik = useFormik({
    initialValues: {
      type_id: "",
      phone_from: user?.phone,
      username_from: [user?.firstname, user?.lastname].join(" "),
      location_from: {
        latitude: latlng?.split(",")[0],
        longitude: latlng?.split(",")[1],
      },
      address_from: address,
      house_from: undefined,
      stage_from: undefined,
      room_from: undefined,
      phone_to: "",
      username_to: "",
      location_to: {
        latitude: latlng?.split(",")[0],
        longitude: (Number(latlng?.split(",")[1]) + 1).toString(),
      },
      address_to: address,
      house_to: undefined,
      stage_to: undefined,
      room_to: undefined,
      delivery_date: dayjs().add(1, "day").format("YYYY-MM-DD"),
      delivery_time: "13:00",
      note: "",
      images: [],
      payment_type_id: undefined,
      description: undefined,
      qr_value: undefined,
      instructions: undefined,
    },
    onSubmit: (values: Partial<ParcelFormValues>) => {
      const body = {
        currency_id: currency?.id,
        type_id: values.type_id,
        rate: currency?.rate,
        phone_from: values.phone_from,
        username_from: values.username_from,
        address_from: {
          latitude: Number(values.location_from?.latitude),
          longitude: Number(values.location_from?.longitude),
          address: values.address_from,
          house: values.house_from,
          stage: values.stage_from,
          room: values.room_from,
        },
        phone_to: values.phone_to,
        username_to: values.username_to,
        address_to: {
          latitude: Number(values.location_to?.latitude),
          longitude: Number(values.location_to?.longitude),
          address: values.address_to,
          house: values.house_to,
          stage: values.stage_to,
          room: values.room_to,
        },
        delivery_date: values.delivery_date,
        delivery_time: values.delivery_time,
        note: values.note,
        images: values.images,
        description: values.description,
        instructions: values.instructions,
        notify: values.notify ? 1 : 0,
        qr_value: values.qr_value,
      };
      mutate(body);
    },
    validate: (values: Partial<ParcelFormValues>) => {
      const errors: Partial<ParcelFormValues> = {};
      const re = /^[\+]?[0-9\b]+$/;
      if (!values.type_id) {
        errors.type_id = t("required");
      }
      if (!values.payment_type_id) {
        errors.payment_type_id = t("required");
      }
      if (!values.phone_from) {
        errors.phone_from = t("required");
      } else if (!re.test(values.phone_from)) {
        errors.phone_from = t("invalid");
      }
      if (!values.username_from) {
        errors.username_from = t("required");
      }
      if (!values.address_from) {
        errors.address_from = t("required");
      }
      if (!values.phone_to) {
        errors.phone_to = t("required");
      } else if (!re.test(values.phone_to)) {
        errors.phone_to = t("invalid");
      }
      if (!values.username_to) {
        errors.username_to = t("required");
      }
      if (!values.address_to) {
        errors.address_to = t("required");
      }
      if (!values.delivery_date) {
        errors.delivery_date = t("required");
      }
      if (!values.delivery_time) {
        errors.delivery_time = t("required");
      }
      return errors;
    },
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => parcelService.create(data),
    onSuccess: (data) => {
      const paymentId = formik.values.payment_type_id;
      const payload = {
        id: data.data.id,
        payment: { payment_sys_id: paymentId },
      };
      const paymentType = payments?.data.find(
        (item) => item.id == paymentId
      )?.tag;
      if (paymentType === "stripe") {
        stripePay({ order_id: payload.id });
      }
      if (paymentType === "razorpay") {
        razorPay({ order_id: payload.id });
      }
      if (paymentType === "paystack") {
        paystackPay({ order_id: payload.id });
      }
      transactionCreate(payload);
    },
    onError: () => {
      error(t("error.400"));
    },
  });

  const { isLoading: isLoadingTransaction, mutate: transactionCreate } =
    useMutation({
      mutationFn: (data: any) =>
        paymentService.parcelTransaction(data.id, data.payment),
      onSuccess: (data) => {
        push(`/parcels/${data.data.id}`);
      },
      onError: (err: any) => {
        error(err?.data?.message);
      },
    });

  const { isLoading: isLoadingPay, mutate: stripePay } = useMutation({
    mutationFn: (data: any) => paymentService.stripePay(data),
    onSuccess: (data) => {
      window.location.replace(data.data.data.url);
    },
    onError: (err: any) => {
      error(err?.data?.message);
    },
  });

  const { isLoading: isLoadingRazorPay, mutate: razorPay } = useMutation({
    mutationFn: (data: any) => paymentService.razorPay(data),
    onSuccess: (data) => {
      window.location.replace(data.data.data.url);
    },
    onError: (err: any) => {
      error(err?.data?.message);
    },
  });

  const { isLoading: isLoadingPaystack, mutate: paystackPay } = useMutation({
    mutationFn: (data: any) => paymentService.paystackPay(data),
    onSuccess: (data) => {
      window.location.replace(data.data.data.url);
    },
    onError: (err: any) => {
      error(err?.data?.message);
    },
  });

  return (
    <div className={cls.root}>
      <div className={cls.container}>
        <div className="container">
          <div className={cls.header}>
            <h1 className={cls.title}>{t("door.to.door.delivery")}</h1>
          </div>
        </div>
      </div>
      <div className="container">
        <form className={cls.wrapper} onSubmit={formik.handleSubmit}>
          <Grid container spacing={isDesktop ? 4 : 1}>
            {isAuthenticated ? (
              React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                  formik,
                  loading:
                    isLoading ||
                    isLoadingTransaction ||
                    isLoadingPay ||
                    isLoadingRazorPay ||
                    isLoadingPaystack,
                  selectedType,
                  handleSelectType,
                });
              })
            ) : (
              <ShopForm xs={12} md={8}>
                <Unauthorized text={t("sign.in.parcel.order")} />
              </ShopForm>
            )}
          </Grid>
        </form>
      </div>
    </div>
  );
}
