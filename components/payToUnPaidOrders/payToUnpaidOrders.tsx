import React, { useMemo } from "react";
import cls from "./payToUnpaidOrders.module.scss";
import PrimaryButton from "components/button/primaryButton";
import { useMediaQuery } from "@mui/material";
import useModal from "hooks/useModal";
import dynamic from "next/dynamic";
import { useSettings } from "contexts/settings/settings.context";
import { useMutation, useQuery, useQueryClient } from "react-query";
import paymentService from "services/payment";
import { BASE_URL, UNPAID_STATUSES } from "constants/constants";
import { Order, Payment } from "interfaces";
import PaymentMethod from "components/paymentMethod/paymentMethod";
import { useTranslation } from "react-i18next";
import { error } from "components/alert/toast";

const DrawerContainer = dynamic(() => import("containers/drawer/drawer"));
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));

type Props = {
  data?: Order;
};

export default function PayToUnpaidOrders({ data }: Props) {
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [
    paymentMethodDrawer,
    handleOpenPaymentMethod,
    handleClosePaymentMethod,
  ] = useModal();

  const { settings } = useSettings();

  const { data: payments } = useQuery(
    "payments",
    () => paymentService.getAll(),
    {
      enabled:
        UNPAID_STATUSES.includes(data?.transaction?.status || "paid") &&
        data?.transaction?.payment_system.tag !== "cash",
    }
  );

  const { paymentTypes } = useMemo(() => {
    let defaultPaymentType: Payment | undefined;
    let paymentTypesList: Payment[];
    if (settings?.payment_type === "admin") {
      defaultPaymentType = payments?.data.find(
        (item: Payment) => item.tag === "cash"
      );
      paymentTypesList = payments?.data || [];
    } else {
      defaultPaymentType = data?.shop?.shop_payments?.find(
        (item) => item.payment.tag === "cash"
      )?.payment;
      paymentTypesList =
        data?.shop?.shop_payments?.map((item) => item.payment) || [];
    }
    return {
      paymentType: defaultPaymentType,
      paymentTypes: paymentTypesList,
    };
  }, [settings, data, payments]);

  const { isLoading: isLoadingTransaction, mutate: transactionCreate } =
    useMutation({
      mutationFn: (data: any) =>
        paymentService.createTransaction(data.id, data.payment),
      onSuccess: () => {
        queryClient.invalidateQueries(["profile"], { exact: false });
        queryClient.invalidateQueries(["order", data?.id, i18n.language]);
      },
      onError: (err: any) => {
        error(err?.data?.message);
      },
      onSettled: () => {
        handleClosePaymentMethod();
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


  const payAgain = (tag: string) => {
    const payment = paymentTypes.find((paymentType) => paymentType.tag === tag);
    const payload = {
      id: data?.id,
      payment: {
        payment_sys_id: payment?.id,
      },
    };
    if (tag === "stripe") {
      stripePay({ order_id: payload.id });
    }
    if (tag === "razorpay") {
      razorPay({ order_id: payload.id });
    }
    if (tag === "paystack") {
      paystackPay({ order_id: payload.id });
    }
    if (tag === "alipay") {
      window.location.replace(
        `${BASE_URL}/api/alipay-prepay?order_id=${payload.id}`
      );
    }
    transactionCreate(payload);
  };

  return (
    <>
      <div className={cls.payButton}>
        <PrimaryButton onClick={handleOpenPaymentMethod} type="button">
          {t("pay")}
        </PrimaryButton>
      </div>
      {isDesktop ? (
        <DrawerContainer
          open={paymentMethodDrawer}
          onClose={handleClosePaymentMethod}
          title={t("payment.method")}
        >
          <PaymentMethod
            value={data?.transaction?.payment_system.tag}
            list={paymentTypes}
            handleClose={handleClosePaymentMethod}
            isButtonLoading={
              isLoadingTransaction ||
              isLoadingPay ||
              isLoadingPaystack ||
              isLoadingRazorPay 
            }
            onSubmit={(tag) => {
              if (tag) {
                payAgain(tag);
              }
            }}
          />
        </DrawerContainer>
      ) : (
        <MobileDrawer
          open={paymentMethodDrawer}
          onClose={handleClosePaymentMethod}
          title={t("payment.method")}
        >
          <PaymentMethod
            value={data?.transaction?.payment_system.tag}
            list={paymentTypes}
            handleClose={handleClosePaymentMethod}
            onSubmit={(tag) => {
              if (tag) {
                payAgain(tag);
              }
            }}
          />
        </MobileDrawer>
      )}
    </>
  );
}
