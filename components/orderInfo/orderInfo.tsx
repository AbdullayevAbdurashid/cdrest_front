import React from "react";
import { Order } from "interfaces";
import cls from "./orderInfo.module.scss";
import { useTranslation } from "react-i18next";
import PhoneFillIcon from "remixicon-react/PhoneFillIcon";
import Chat1FillIcon from "remixicon-react/Chat1FillIcon";
import DarkButton from "components/button/darkButton";
import SecondaryButton from "components/button/secondaryButton";
import CustomerService2FillIcon from "remixicon-react/CustomerService2FillIcon";
import RepeatOneFillIcon from "remixicon-react/RepeatOneFillIcon";
import Price from "components/price/price";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import useModal from "hooks/useModal";
import orderService from "services/order";
import { useMutation } from "react-query";
import { error, success } from "components/alert/toast";
import { useRouter } from "next/router";
import cartService from "services/cart";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import {
  clearUserCart,
  selectUserCart,
  updateUserCart,
} from "redux/slices/userCart";
import calculateOrderSubTotal from "utils/calculateOrderSubTotal";
import Chat from "components/chat/chat";
import Avatar from "components/avatar";
import { UNPAID_STATUSES } from "constants/constants";

const ConfirmationModal = dynamic(
  () => import("components/confirmationModal/confirmationModal")
);
const OrderRefund = dynamic(
  () => import("containers/orderRefundContainer/orderRefundContainer")
);
const DrawerContainer = dynamic(() => import("containers/drawer/drawer"));
const PayToUnpaidOrders = dynamic(
  () => import("components/payToUnPaidOrders/payToUnpaidOrders")
);

type Props = {
  data?: Order;
};

export default function OrderInfo({ data }: Props) {
  const { t } = useTranslation();
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectUserCart);
  const [openModal, handleOpen, handleClose] = useModal();
  const [openChat, handleOpenChat, handleCloseChat] = useModal();
  const canRefund = !data?.order_refunds?.some(
    (item) => item.status === "approved" || item.status === "pending"
  );
  const subTotal = calculateOrderSubTotal(data);

  const { mutate: orderCancel, isLoading } = useMutation({
    mutationFn: () => orderService.cancel(data?.id || 0),
    onSuccess: () => {
      handleClose();
      push("/orders");
      success(t("order.cancelled"));
    },
    onError: (err: any) => error(err?.statusCode),
  });

  const { isLoading: loadingRepeatOrder, mutate: insertProducts } = useMutation(
    {
      mutationFn: (data: any) => cartService.insert(data),
      onSuccess: (data) => {
        dispatch(updateUserCart(data.data));
        push(`/restaurant/${data.data.shop_id}/checkout`);
      },
      onError: () => {
        error(t("error.400"));
      },
    }
  );

  const { isLoading: isLoadingClearCart, mutate: mutateClearCart } =
    useMutation({
      mutationFn: (data: any) => cartService.delete(data),
      onSuccess: () => {
        dispatch(clearUserCart());
        repeatOrder();
      },
    });

  function repeatOrder() {
    if (!checkIsAbleToAddProduct()) {
      mutateClearCart({ ids: [cart.id] });
      return;
    }
    let products: any[] = [];
    data?.details.forEach((item) => {
      const addons = item.addons.map((el) => ({
        stock_id: el.stock.id,
        quantity: el.quantity,
        parent_id: item.stock.id,
      }));
      if (!item.bonus) {
        products.push({
          stock_id: item.stock.id,
          quantity: item.quantity,
        });
      }
      products.push(...addons);
    });
    const payload = {
      shop_id: data?.shop.id,
      currency_id: data?.currency?.id,
      rate: data?.rate,
      products,
    };
    insertProducts(payload);
  }

  function checkIsAbleToAddProduct() {
    return cart.shop_id === 0 || cart.shop_id === data?.shop.id;
  }

  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <div>
          <h4 className={cls.title}>{t("order")}</h4>
          <div className={cls.subtitle}>
            <span className={cls.text}>#{data?.id}</span>
            <span className={cls.dot} />
            <span className={cls.text}>
              {dayjs(data?.created_at).format("MMM DD, HH:mm")}
            </span>
          </div>
        </div>
        {data?.status === "delivered" && canRefund && <OrderRefund />}
      </div>
      <div className={cls.address}>
        {data?.delivery_type === "pickup" ? (
          <label>{t("pickup.address")}</label>
        ) : (
          <label>{t("delivery.address")}</label>
        )}
        <h6 className={cls.text}>{data?.address?.address}</h6>
        <br />
        {data?.delivery_type === "pickup" ? (
          <label>{t("pickup.time")}</label>
        ) : (
          <label>{t("delivery.time")}</label>
        )}
        <h6 className={cls.text}>
          {dayjs(data?.delivery_date).format("ddd, MMM DD,")}{" "}
          {data?.delivery_time}
        </h6>
        <br />
        <label>{t("payment.type")}</label>
        <h6 className={cls.text} style={{ textTransform: "capitalize" }}>
          {t(data?.transaction?.payment_system.tag)}
        </h6>
        <br />
        <label>{t("payment.status")}</label>
        <h6 className={cls.text} style={{ textTransform: "capitalize" }}>
          {t(data?.transaction?.status)}
        </h6>
      </div>
      <div className={cls.body}>
        <div className={cls.flex}>
          <label>{t("subtotal")}</label>
          <span className={cls.price}>
            <Price number={subTotal} symbol={data?.currency?.symbol} />
          </span>
        </div>
        <div className={cls.flex}>
          <label>{t("delivery.price")}</label>
          <span className={cls.price}>
            <Price
              number={data?.delivery_fee}
              symbol={data?.currency?.symbol}
            />
          </span>
        </div>
        <div className={cls.flex}>
          <label>{t("shop.tax")}</label>
          <span className={cls.price}>
            <Price number={data?.tax} symbol={data?.currency?.symbol} />
          </span>
        </div>
        <div className={cls.flex}>
          <label>{t("discount")}</label>
          <span className={cls.discount}>
            <Price
              number={data?.total_discount}
              minus
              symbol={data?.currency?.symbol}
            />
          </span>
        </div>
        {!!data?.coupon && (
          <div className={cls.flex}>
            <label>{t("promo.code")}</label>
            <span className={cls.discount}>
              <Price
                number={data.coupon.price}
                minus
                symbol={data.currency?.symbol}
              />
            </span>
          </div>
        )}
        <div className={cls.flex}>
          <label>{t("service.fee")}</label>
          <span className={cls.price}>
            <Price number={data?.service_fee} symbol={data?.currency?.symbol} />
          </span>
        </div>
        <div className={cls.flex}>
          <label>{t("total")}</label>
          <span className={cls.totalPrice}>
            <Price
              number={data && data?.total_price < 0 ? 0 : data?.total_price}
              symbol={data?.currency?.symbol}
            />
          </span>
        </div>
      </div>
      {data?.deliveryman ? (
        <div className={cls.courierBlock}>
          <div className={cls.courier}>
            <div className={cls.avatar}>
              <div className={cls.imgWrapper}>
                <Avatar data={data.deliveryman} />
              </div>
              {/* <span className={cls.rating}>4.5</span> */}
            </div>
            <div className={cls.naming}>
              <h5 className={cls.name}>
                {data.deliveryman.firstname}{" "}
                {data.deliveryman.lastname?.charAt(0)}.
              </h5>
              <p className={cls.text}>{t("driver")}</p>
            </div>
          </div>
          <div className={cls.actions}>
            <a href={`tel:${data.deliveryman.phone}`} className={cls.iconBtn}>
              <PhoneFillIcon />
            </a>
            <button className={cls.iconBtn} onClick={handleOpenChat}>
              <Chat1FillIcon />
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {UNPAID_STATUSES.includes(data?.transaction?.status || "paid") &&
      data?.transaction?.payment_system.tag !== "cash" ? (
        <PayToUnpaidOrders data={data} />
      ) : (
        ""
      )}
      {data?.status === "new" ? (
        <div className={cls.footer}>
          <SecondaryButton type="button" onClick={handleOpen}>
            {t("cancel.order")}
          </SecondaryButton>
        </div>
      ) : data?.status === "delivered" || data?.status === "canceled" ? (
        <div className={cls.footer}>
          <a
            href={`tel:${data.shop.phone}`}
            style={{ display: "block", width: "100%" }}
          >
            <DarkButton icon={<CustomerService2FillIcon />} type="button">
              {t("support")}
            </DarkButton>
          </a>
          <SecondaryButton
            icon={<RepeatOneFillIcon />}
            type="button"
            onClick={repeatOrder}
            loading={isLoadingClearCart || loadingRepeatOrder}
          >
            {t("repeat.order")}
          </SecondaryButton>
        </div>
      ) : (
        ""
      )}

      <ConfirmationModal
        open={openModal}
        handleClose={handleClose}
        onSubmit={orderCancel}
        loading={isLoading}
        title={t("are.you.sure.cancel.order")}
      />

      <DrawerContainer
        open={openChat}
        onClose={handleCloseChat}
        PaperProps={{ style: { padding: 0 } }}
      >
        <Chat />
      </DrawerContainer>
    </div>
  );
}
