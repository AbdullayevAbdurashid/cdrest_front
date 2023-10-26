import React, { useMemo } from "react";
import cls from "./checkout.module.scss";
import { IShop, OrderFormValues, Payment } from "interfaces";
import CheckoutPayment from "containers/checkoutPayment/checkoutPayment";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import { useFormik } from "formik";
import { useSettings } from "contexts/settings/settings.context";
import orderService from "services/order";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrency } from "redux/slices/currency";
import { selectUserCart } from "redux/slices/userCart";
import BonusCaption from "components/bonusCaption/bonusCaption";
import paymentService from "services/payment";
import { error, warning } from "components/alert/toast";
import { useTranslation } from "react-i18next";
import useShopWorkingSchedule from "hooks/useShopWorkingSchedule";
import getFirstValidDate from "utils/getFirstValidDate";
import { selectOrder } from "redux/slices/order";

type Props = {
  data: IShop;
  children: any;
  onPhoneVerify: () => void;
};

export default function CheckoutContainer({
  data,
  children,
  onPhoneVerify,
}: Props) {
  const { t } = useTranslation();
  const { settings, address, location } = useSettings();
  const latlng = location;
  const { replace } = useRouter();
  const currency = useAppSelector(selectCurrency);
  const cart = useAppSelector(selectUserCart);
  const { order } = useAppSelector(selectOrder);
  const { isOpen } = useShopWorkingSchedule(data);
  const queryClient = useQueryClient();

  const { data: payments } = useQuery("payments", () =>
    paymentService.getAll()
  );

  const { paymentType, paymentTypes } = useMemo(() => {
    let defaultPaymentType: Payment | undefined;
    let paymentTypesList: Payment[];
    if (settings?.payment_type === "admin") {
      defaultPaymentType = payments?.data.find(
        (item: Payment) => item.tag === "cash"
      );
      paymentTypesList = payments?.data || [];
    } else {
      defaultPaymentType = data?.shop_payments?.find(
        (item) => item.payment.tag === "cash"
      )?.payment;
      paymentTypesList = data?.shop_payments?.map((item) => item.payment) || [];
    }
    return {
      paymentType: defaultPaymentType,
      paymentTypes: paymentTypesList,
    };
  }, [settings, data, payments]);

  const formik = useFormik({
    initialValues: {
      coupon: undefined,
      location: {
        latitude: latlng?.split(",")[0],
        longitude: latlng?.split(",")[1],
      },
      address: {
        address,
        office: "",
        house: "",
        floor: "",
      },
      delivery_date: order.delivery_date || getFirstValidDate(data).date,
      delivery_time: order.delivery_time || getFirstValidDate(data).time,
      delivery_type: "delivery",
      note: undefined,
      payment_type: paymentType,
      for_someone: false,
      username: undefined,
      phone: undefined,
      notes: {},
    },
    enableReinitialize: true,
    onSubmit: (values: OrderFormValues) => {
      const trimmedPhone = values.phone?.replace(/[^0-9]/g, "");
      if (!values.payment_type) {
        warning(t("choose.payment.method"));
        return;
      }
      if (!isOpen) {
        warning(t("shop.closed"));
        return;
      }
      if (values.for_someone) {
        if (!values.username || !values.phone) {
          warning(t("user.details.empty"));
          return;
        }
        if (!trimmedPhone) {
          warning(t("phone.invalid"));
          return;
        }
      }
      const payload = {
        ...values,
        currency_id: currency?.id,
        rate: currency?.rate,
        shop_id: data.id,
        cart_id: cart.id,
        payment_type: undefined,
        for_someone: undefined,
        phone: values.for_someone ? trimmedPhone : undefined,
        username: values.for_someone ? values.username : undefined,
        delivery_time: values.delivery_time?.split(" - ")?.at(0),
        coupon: values?.coupon && values.coupon.length > 0 ? values?.coupon : undefined,
        note: values?.note && values.note.length > 0 ? values?.note : undefined
      };
      mutate(payload);
    },
    validate: (values: OrderFormValues) => {
      const errors = {} as OrderFormValues;
      return errors;
    },
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => orderService.create(data),
    onSuccess: (data) => {
      const payload = {
        id: data.data.id,
        payment: {
          payment_sys_id: formik.values.payment_type?.id,
        },
      };
      if (formik.values.payment_type?.tag === "stripe") {
        stripePay({ order_id: payload.id });
      }
      if (formik.values.payment_type?.tag === "razorpay") {
        razorPay({ order_id: payload.id });
      }
      if (formik.values.payment_type?.tag === "paystack") {
        paystackPay({ order_id: payload.id });
      }
      transactionCreate(payload);
    },
    onError: (err: any) => {
      error(err?.data?.message);
    },
  });

  const { isLoading: isLoadingTransaction, mutate: transactionCreate } =
    useMutation({
      mutationFn: (data: any) =>
        paymentService.createTransaction(data.id, data.payment),
      onSuccess: (data) => {
        replace(`/orders/${data.data.id}`);
        queryClient.invalidateQueries(["profile"], { exact: false });
        queryClient.invalidateQueries(["cart"], { exact: false });
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
            <ShopLogoBackground data={data} />
            <div className={cls.shop}>
              <h1 className={cls.title}>{data?.translation.title}</h1>
              <p className={cls.text}>
                {data?.bonus ? (
                  <BonusCaption data={data?.bonus} />
                ) : (
                  data?.translation?.description
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <section className={cls.wrapper}>
          <main className={cls.body}>
            {React.Children.map(children, (child) => {
              return React.cloneElement(child, { data, formik, onPhoneVerify });
            })}
          </main>
          <aside className={cls.aside}>
            <CheckoutPayment
              formik={formik}
              shop={data}
              loading={
                isLoading ||
                isLoadingTransaction ||
                isLoadingPay ||
                isLoadingRazorPay ||
                isLoadingPaystack
              }
              payments={paymentTypes}
              onPhoneVerify={onPhoneVerify}
            />
          </aside>
        </section>
      </div>
    </div>
  );
}
