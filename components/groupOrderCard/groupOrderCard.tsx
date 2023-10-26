import React, { useState } from "react";
import cls from "./groupOrderCard.module.scss";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import PrimaryButton from "components/button/primaryButton";
import { useTranslation } from "react-i18next";
import FileCopyFillIcon from "remixicon-react/FileCopyFillIcon";
import { WEBSITE_URL } from "constants/constants";
import User6LineIcon from "remixicon-react/User6LineIcon";
import { error, info, success } from "components/alert/toast";
import { useMutation, useQuery } from "react-query";
import cartService from "services/cart";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import {
  clearUserCart,
  selectUserCart,
  updateGroupStatus,
  updateUserCart,
} from "redux/slices/userCart";
import SecondaryButton from "components/button/secondaryButton";
import { CircularProgress } from "@mui/material";
import Loading from "components/loader/loading";
import { useShop } from "contexts/shop/shop.context";
import { selectCurrency } from "redux/slices/currency";
import useShopType from "hooks/useShopType";

type Props = {
  handleClose: () => void;
};

export default function GroupOrderCard({ handleClose }: Props) {
  const { t } = useTranslation();
  const [userLoading, setUserLoading] = useState("");
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectUserCart);
  const currency = useAppSelector(selectCurrency);
  const { query } = useRouter();
  const shopId = Number(query.id);
  const { isOpen } = useShop();
  const type = useShopType();
  const groupOrderUrl = `${WEBSITE_URL}/group/${shopId}?g=${cart.id}&o=${cart.owner_id}&t=${type}`;

  const { isFetching, refetch } = useQuery(
    ["openCart", shopId],
    () => cartService.open({ shop_id: shopId, currency_id: currency?.id }),
    {
      onSuccess: (data) => {
        dispatch(updateUserCart(data.data));
      },
      enabled: !cart.id,
      retry: false,
    }
  );

  const { mutate: openGroup, isLoading: isGroupLoading } = useMutation({
    mutationFn: (data: any) => cartService.setGroup(data),
    onSuccess: (data) => {
      dispatch(updateGroupStatus(data.data));
    },
  });

  const { mutate: deleteCart, isLoading: isDeleteCartLoading } = useMutation({
    mutationFn: (data: any) => cartService.delete(data),
    onSuccess: (_, values) => {
      dispatch(clearUserCart());
      if (values.open) {
        refetch().then(({ data }) => openGroup(data?.data.id));
      } else {
        handleClose();
      }
    },
  });

  const { mutate: memberDelete } = useMutation({
    mutationFn: (data: any) => cartService.deleteGuest(data),
    onSuccess: (_, values) => {
      let newCart = JSON.parse(JSON.stringify(cart));
      newCart.user_carts = cart.user_carts.filter(
        (item) => item.uuid !== values["ids[0]"]
      );
      dispatch(updateUserCart(newCart));
    },
    onSettled: () => setUserLoading(""),
  });

  const deleteMember = (uuid: string) => {
    setUserLoading(uuid);
    const payload = {
      cart_id: cart.id,
      "ids[0]": uuid,
    };
    memberDelete(payload);
  };

  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(groupOrderUrl);
      success(t("copied"));
    } catch (err) {
      error("Failed to copy!");
    }
  };

  function handleClickStart() {
    if (!isOpen) {
      info(t("shop.closed"));
      return;
    }
    if (cart.shop_id === shopId) {
      openGroup(cart.id);
    } else {
      clearCartItems({}, true);
    }
  }

  function clearCartItems(event?: any, open?: boolean) {
    const ids = [cart.id];
    deleteCart({ ids, open });
  }

  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <h2 className={cls.title}>
          {cart.group ? t("manage.group.order") : t("start.group.order")}
        </h2>
        <p className={cls.text}>{t("group.order.text")}</p>
      </div>

      {cart.group && (
        <div className={cls.actions}>
          <div className={cls.groupLink}>
            <span className={cls.text}>{groupOrderUrl}</span>
          </div>
          <button className={cls.iconBtn} onClick={() => copyToClipBoard()}>
            <FileCopyFillIcon />
          </button>
        </div>
      )}

      {cart.group && (
        <div className={cls.members}>
          <h4 className={cls.title}>{t("group.members")}</h4>
          {cart.user_carts.map((item) => (
            <div
              key={item.id}
              className={cls.row}
              style={{
                display: item.user_id === cart.owner_id ? "none" : "flex",
              }}
            >
              <div className={cls.member}>
                <div className={cls.avatar}>
                  <User6LineIcon />
                </div>
                <label className={cls.label}>{item.name}</label>
              </div>
              <div className={cls.flex}>
                <div
                  className={`${cls.status} ${
                    item.status ? cls.orange : cls.green
                  }`}
                >
                  <span className={cls.text}>
                    {item.status ? t("choosing") : t("done")}
                  </span>
                </div>
                <button
                  className={cls.timesBtn}
                  onClick={() => deleteMember(item.uuid)}
                  disabled={userLoading === item.uuid}
                >
                  {userLoading === item.uuid ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CloseFillIcon />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={cls.footer}>
        <div className={cls.btnWrapper}>
          {cart.group ? (
            <SecondaryButton onClick={() => clearCartItems({}, false)}>
              {t("cancel")}
            </SecondaryButton>
          ) : (
            <PrimaryButton onClick={handleClickStart}>
              {t("start")}
            </PrimaryButton>
          )}
        </div>
      </div>

      {(isFetching || isDeleteCartLoading || isGroupLoading) && <Loading />}
    </div>
  );
}
