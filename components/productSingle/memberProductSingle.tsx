import React, { useEffect, useState } from "react";
import { Product, ProductExtra, Stock } from "interfaces";
import { getExtras, sortExtras } from "utils/getExtras";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { useMutation, useQuery } from "react-query";
import cartService from "services/cart";
import {
  clearUserCart,
  selectUserCart,
  updateUserCart,
} from "redux/slices/userCart";
import useModal from "hooks/useModal";
import { useRouter } from "next/router";
import productService from "services/product";
import ProductUI from "./productUI";
import { useShop } from "contexts/shop/shop.context";
import AddonsForm from "components/extrasForm/addonsForm";
import ConfirmationModal from "components/confirmationModal/confirmationModal";
import { useTranslation } from "react-i18next";
import { selectCurrency } from "redux/slices/currency";

type Props = {
  handleClose: () => void;
  uuid: string;
};
type ShowExtrasType = {
  extras: Array<ProductExtra[]>;
  stock: Stock;
};
type SelectedAddon = {
  id: string;
  quantity: number;
};

export default function MemberProductSingle({ handleClose, uuid }: Props) {
  const { t } = useTranslation();
  const [counter, setCounter] = useState(1);
  const [extras, setExtras] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [showExtras, setShowExtras] = useState<ShowExtrasType>({
    extras: [],
    stock: {
      id: 0,
      quantity: 1,
      price: 0,
    },
  });
  const [extrasIds, setExtrasIds] = useState<any[]>([]);
  const [addons, setAddons] = useState<Product[]>([]);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectUserCart);
  const currency = useAppSelector(selectCurrency);
  const [openPrompt, handleOpenPrompt, handleClosePrompt] = useModal();
  const { query } = useRouter();
  const shopId = Number(query.id);
  const { clearMember, member } = useShop();
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  const { data } = useQuery(
    ["product", uuid, currency],
    () => productService.getById(uuid, { currency_id: currency?.id }),
    {
      enabled: Boolean(uuid),
      select: (data) => data.data,
    }
  );

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => cartService.insertGuest(data),
    onSuccess: (data) => {
      dispatch(updateUserCart(data.data));
      handleClose();
    },
  });

  const { mutate: leaveGroup, isLoading: isLoadingGroupLeave } = useMutation({
    mutationFn: (data: any) => cartService.guestLeave(data),
    onSuccess: () => {
      dispatch(clearUserCart());
      handleClosePrompt();
      clearMember();
    },
  });

  useEffect(() => {
    if (data) {
      setCounter(data.min_qty || 1);
      const myData = sortExtras(data);
      setExtras(myData.extras);
      setStock(myData.stock);
      setShowExtras(getExtras("", myData.extras, myData.stock));
      getExtras("", myData.extras, myData.stock).extras?.forEach((element) => {
        setExtrasIds((prev) => [...prev, element[0]]);
      });
    }
  }, [data]);

  const handleExtrasClick = (e: any) => {
    setSelectedAddons([]);
    const index = extrasIds.findIndex(
      (item) => item.extra_group_id === e.extra_group_id
    );
    let array = extrasIds;
    if (index > -1) array = array.slice(0, index);
    array.push(e);
    const nextIds = array.map((item) => item.id).join(",");
    var extrasData = getExtras(nextIds, extras, stock);
    setShowExtras(extrasData);
    extrasData.extras?.forEach((element) => {
      const index = extrasIds.findIndex((item) =>
        element[0].extra_group_id != e.extra_group_id
          ? item.extra_group_id === element[0].extra_group_id
          : item.extra_group_id === e.extra_group_id
      );
      if (element[0].level >= e.level) {
        var itemData =
          element[0].extra_group_id != e.extra_group_id ? element[0] : e;
        if (index == -1) array.push(itemData);
        else {
          array[index] = itemData;
        }
      }
    });
    setExtrasIds(array);
  };

  function addCounter() {
    setCounter((prev) => prev + 1);
  }

  function reduceCounter() {
    setCounter((prev) => prev - 1);
  }

  function handleAddToCart() {
    if (!checkIsAbleToAddProduct()) {
      handleOpenPrompt();
      return;
    }
    storeCart();
  }

  function getAddonQuantity(stock_id?: number) {
    const addon = addons.find((el) => el.stock?.id === stock_id);
    if (addon) {
      return addon.stock?.quantity;
    } else {
      return 0;
    }
  }

  function storeCart() {
    const defaultAddons =
      showExtras.stock.addons?.filter((item) => !!item.product) || [];
    const products: {
      stock_id?: number;
      quantity?: number;
      parent_id: number;
    }[] = [];
    defaultAddons.forEach((item) => {
      if (getAddonQuantity(item.product?.stock?.id) !== 0) {
        products.push({
          stock_id: item.product?.stock?.id,
          quantity: getAddonQuantity(item.product?.stock?.id),
          parent_id: showExtras.stock.id,
        });
      }
    });
    const body = {
      shop_id: shopId,
      cart_id: member?.cart_id,
      user_cart_uuid: member?.uuid,
      products: [
        {
          stock_id: showExtras.stock.id,
          quantity: counter,
        },
        ...products,
      ],
    };
    mutate(body);
  }

  function checkIsAbleToAddProduct() {
    let isActiveCart: boolean;
    isActiveCart = cart.shop_id === 0 || cart.shop_id === shopId;
    return isActiveCart;
  }

  function handleAddonClick(list: Product[]) {
    setAddons(list);
  }

  function calculateTotalPrice() {
    const addonPrice = addons.reduce(
      (total, item) =>
        (total +=
          Number(item.stock?.total_price) * Number(item.stock?.quantity)),
      0
    );
    return addonPrice + Number(showExtras.stock.total_price) * counter;
  }

  function handleLeave() {
    leaveGroup({ ids: [member?.uuid], cart_id: cart.id });
  }

  return (
    <div>
      <ProductUI
        data={data || {}}
        loading={!!data}
        stock={showExtras.stock}
        extras={showExtras.extras}
        counter={counter}
        addCounter={addCounter}
        reduceCounter={reduceCounter}
        handleExtrasClick={handleExtrasClick}
        handleAddToCart={handleAddToCart}
        loadingBtn={isLoading}
        totalPrice={calculateTotalPrice()}
        extrasIds={extrasIds}
      >
        <AddonsForm
          data={showExtras.stock.addons || []}
          handleAddonClick={handleAddonClick}
          quantity={counter}
          selectedAddons={selectedAddons}
          onSelectAddon={setSelectedAddons}
        />
      </ProductUI>
      <ConfirmationModal
        open={openPrompt}
        handleClose={handleClosePrompt}
        onSubmit={handleLeave}
        loading={isLoadingGroupLeave}
        title={t("leave.group.prompt")}
      />
    </div>
  );
}
